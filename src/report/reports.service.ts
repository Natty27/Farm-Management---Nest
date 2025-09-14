// reports.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cow } from './../cow/schemas/cow.schema';
import { Customer } from './../customer/schemas/customer.schema';
import {
  Expense,
  ExpenseCategory,
  ExpenseType,
} from './../expense/schemas/expense.schema';
import {
  MilkingRecord,
  MilkingTime,
  MilkSourceType,
} from './../milkingRecord/schemas/milkingRecord.schema';
import { Sale, ProductType } from './../sales/schemas/sales.schema';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ExpenseReport {
  totalExpenses: number;
  byCategory: { category: ExpenseCategory; total: number }[];
  byType: { type: ExpenseType; total: number }[];
  monthlyTrends: { month: string; total: number }[];
}

export interface RevenueReport {
  totalRevenue: number;
  byProduct: { product: ProductType; total: number }[];
  byCustomer: { customer: string; total: number }[];
  monthlyTrends: { month: string; total: number }[];
}

export interface ProfitLossReport {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  monthlyBreakdown: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
}

export interface CowProductionReport {
  cowId: string;
  cowName: string;
  totalMilk: number;
  averageDaily: number;
  averageFat: number;
  averageSNF: number;
  productionTrend: { date: string; amount: number }[];
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  totalPurchases: number;
  averagePurchase: number;
  favoriteProduct: ProductType;
  purchaseHistory: { date: Date; product: ProductType; amount: number }[];
}

// shape of what we accumulate per customer
type CustomerAggregate = {
  customerId: string;
  customerName: string;
  totalPurchases: number;
  purchaseCount: number;
  products: Record<string, number>; // or Record<ProductType, number>
  purchaseHistory: Array<{ date: Date; product: ProductType; amount: number }>;
};

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Cow.name) private cowModel: Model<Cow>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    @InjectModel(MilkingRecord.name)
    private milkingRecordModel: Model<MilkingRecord>,
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
  ) {}

  // Helper method to convert MongoDB String objects to primitive strings
  private convertToString(value: any): string {
    return value?.toString() || '';
  }

  // Expense Reports
  async getExpenseReport(dateRange?: DateRange): Promise<ExpenseReport> {
    const filter = dateRange
      ? {
          date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        }
      : {};

    // Get regular expenses
    const expenses = await this.expenseModel.find(filter).exec();

    // Get external provider milking records as expenses
    const externalMilkFilter = {
      source_type: MilkSourceType.EXTERNAL_PROVIDER,
      ...(dateRange
        ? { date: { $gte: dateRange.startDate, $lte: dateRange.endDate } }
        : {}),
    };

    const externalMilkRecords = await this.milkingRecordModel
      .find(externalMilkFilter)
      .exec();

    // Convert external milk records to expense-like objects
    const externalMilkExpenses = externalMilkRecords
      .filter((record) => record.cost_price && record.cost_price > 0)
      .map((record) => ({
        amount: record.cost_price, // total cost = quantity * price per liter
        category: ExpenseCategory.MILK_PURCHASE,
        type: ExpenseType.EXTERNAL_MILK_PURCHASE,
        date: record.date,
        description: `External milk purchase - ${record.amount}L @ ${record.cost_price}/L`,
      }));

    // Combine regular expenses with external milk expenses
    const allExpenses = [...expenses, ...externalMilkExpenses];

    const totalExpenses = allExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const byCategory = Object.values(ExpenseCategory).map((category) => ({
      category,
      total: allExpenses
        .filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0),
    }));

    const byType = Object.values(ExpenseType).map((type) => ({
      type,
      total: allExpenses
        .filter((e) => e.type === type)
        .reduce((sum, e) => sum + e.amount, 0),
    }));

    // Monthly trends
    const monthlyTrends = allExpenses.reduce((acc, expense) => {
      const month = expense.date.toISOString().substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {});

    const monthlyArray = Object.entries(monthlyTrends).map(
      ([month, total]) => ({
        month,
        total: total as number,
      }),
    );

    return {
      totalExpenses,
      byCategory,
      byType,
      monthlyTrends: monthlyArray,
    };
  }

  // Revenue Reports
  async getRevenueReport(dateRange?: DateRange): Promise<RevenueReport> {
    const filter = dateRange
      ? {
          date: { $gte: dateRange.startDate, $lte: dateRange.endDate },
        }
      : {};

    const sales = await this.saleModel.find(filter).populate('customer').exec();

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.total_amount,
      0,
    );

    const byProduct = Object.values(ProductType).map((product) => ({
      product,
      total: sales
        .filter((s) => s.product_type === product)
        .reduce((sum, s) => sum + s.total_amount, 0),
    }));

    const byCustomer = sales.reduce((acc, sale) => {
      const customer = sale.customer as any;
      const customerName = customer?.name
        ? this.convertToString(customer.name)
        : 'Unknown';
      acc[customerName] = (acc[customerName] || 0) + sale.total_amount;
      return acc;
    }, {});

    const customerArray = Object.entries(byCustomer).map(
      ([customer, total]) => ({
        customer,
        total: total as number,
      }),
    );

    // Monthly trends
    const monthlyTrends = sales.reduce((acc, sale) => {
      const month = sale.date.toISOString().substring(0, 7);
      acc[month] = (acc[month] || 0) + sale.total_amount;
      return acc;
    }, {});

    const monthlyArray = Object.entries(monthlyTrends).map(
      ([month, total]) => ({
        month,
        total: total as number,
      }),
    );

    return {
      totalRevenue,
      byProduct,
      byCustomer: customerArray,
      monthlyTrends: monthlyArray,
    };
  }

  // Profit & Loss Report
  async getProfitLossReport(dateRange?: DateRange): Promise<ProfitLossReport> {
    const revenueReport = await this.getRevenueReport(dateRange);
    const expenseReport = await this.getExpenseReport(dateRange);

    const netProfit = revenueReport.totalRevenue - expenseReport.totalExpenses;
    const profitMargin =
      revenueReport.totalRevenue > 0
        ? (netProfit / revenueReport.totalRevenue) * 100
        : 0;

    // Combine monthly data
    const monthlyBreakdown = revenueReport.monthlyTrends.map((revenueMonth) => {
      const expenseMonth = expenseReport.monthlyTrends.find(
        (e) => e.month === revenueMonth.month,
      );
      const expenses = expenseMonth ? expenseMonth.total : 0;
      const profit = revenueMonth.total - expenses;

      return {
        month: revenueMonth.month,
        revenue: revenueMonth.total,
        expenses,
        profit,
      };
    });

    return {
      totalRevenue: revenueReport.totalRevenue,
      totalExpenses: expenseReport.totalExpenses,
      netProfit,
      profitMargin,
      monthlyBreakdown,
    };
  }

  // Cow Production Report - FIXED
  async getCowProductionReport(
    cowId?: string,
    dateRange?: DateRange,
  ): Promise<CowProductionReport[]> {
    const cowFilter = cowId ? { _id: new Types.ObjectId(cowId) } : {};
    const cows = await this.cowModel.find(cowFilter).exec();

    const reports = await Promise.all(
      cows.map(async (cow) => {
        const milkFilter: any = { cow_id: cow._id };

        if (dateRange) {
          milkFilter.date = {
            $gte: dateRange.startDate,
            $lte: dateRange.endDate,
          };
        }

        const milkRecords = await this.milkingRecordModel
          .find(milkFilter)
          .exec();

        const totalMilk = milkRecords.reduce(
          (sum, record) => sum + record.amount,
          0,
        );

        // Get unique days with milk records
        const uniqueDays = new Set(
          milkRecords.map((r) => r.date.toDateString()),
        );
        const days = uniqueDays.size;
        const averageDaily = days > 0 ? totalMilk / days : 0;

        // Calculate averages only for records that have the values
        const fatRecords = milkRecords.filter((r) => r.fat_percentage != null);
        const averageFat =
          fatRecords.length > 0
            ? fatRecords.reduce((sum, r) => sum + r.fat_percentage, 0) /
              fatRecords.length
            : 0;

        const snfRecords = milkRecords.filter((r) => r.snf != null);
        const averageSNF =
          snfRecords.length > 0
            ? snfRecords.reduce((sum, r) => sum + r.snf, 0) / snfRecords.length
            : 0;

        // Production trend (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRecords = milkRecords.filter(
          (r) => r.date >= thirtyDaysAgo,
        );
        const productionTrend = recentRecords.map((record) => ({
          date: record.date.toISOString().substring(0, 10),
          amount: record.amount,
        }));

        return {
          cowId: cow._id.toString(),
          cowName: this.convertToString(cow.name), // Convert String object to primitive string
          totalMilk,
          averageDaily,
          averageFat,
          averageSNF,
          productionTrend,
        };
      }),
    );

    return reports;
  }

  // Customer Analysis Report
  async getCustomerReport(dateRange?: DateRange): Promise<CustomerReport[]> {
    const filter = dateRange
      ? { date: { $gte: dateRange.startDate, $lte: dateRange.endDate } }
      : {};

    const sales = await this.saleModel.find(filter).populate('customer').exec();

    // 👇 Key change: type the reducer accumulator
    const customersMap = sales.reduce<Record<string, CustomerAggregate>>(
      (acc, sale) => {
        const customer = sale.customer as
          | { _id: any; name?: string }
          | null
          | undefined;
        if (!customer) return acc;

        const customerId = String((customer as any)._id);
        if (!acc[customerId]) {
          acc[customerId] = {
            customerId,
            customerName: customer.name
              ? this.convertToString(customer.name)
              : 'Unknown',
            totalPurchases: 0,
            purchaseCount: 0,
            products: {},
            purchaseHistory: [],
          };
        }

        acc[customerId].totalPurchases += sale.total_amount ?? 0;
        acc[customerId].purchaseCount += 1;

        const product = sale.product_type as ProductType;
        acc[customerId].products[product] =
          (acc[customerId].products[product] ?? 0) + 1;

        acc[customerId].purchaseHistory.push({
          date: sale.date as Date,
          product,
          amount: sale.total_amount ?? 0,
        });

        return acc;
      },
      {},
    ); // <= initial value matches the generic type

    // Now Object.values is CustomerAggregate[], not unknown[]
    return Object.values(customersMap).map((c) => ({
      customerId: c.customerId,
      customerName: c.customerName,
      totalPurchases: c.totalPurchases,
      averagePurchase: c.purchaseCount ? c.totalPurchases / c.purchaseCount : 0,
      favoriteProduct:
        (Object.entries(c.products).sort(
          (a, b) => b[1] - a[1],
        )[0]?.[0] as ProductType) ?? ProductType.MILK,
      purchaseHistory: c.purchaseHistory,
    }));
  }
  // Dashboard Summary
  async getDashboardSummary(): Promise<any> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalCows,
      totalCustomers,
      monthlyRevenue,
      yearlyRevenue,
      monthlyExpenses,
      todayMilkProduction,
    ] = await Promise.all([
      this.cowModel.countDocuments(),
      this.customerModel.countDocuments(),
      this.getRevenueReport({ startDate: startOfMonth, endDate: today }),
      this.getRevenueReport({ startDate: startOfYear, endDate: today }),
      this.getExpenseReport({ startDate: startOfMonth, endDate: today }),
      this.milkingRecordModel.aggregate([
        {
          $match: {
            date: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    return {
      totals: {
        cows: totalCows,
        customers: totalCustomers,
        monthlyRevenue: monthlyRevenue.totalRevenue,
        yearlyRevenue: yearlyRevenue.totalRevenue,
        monthlyExpenses: monthlyExpenses.totalExpenses,
        todayMilk: todayMilkProduction[0]?.total || 0,
      },
      quickStats: {
        profitMargin:
          monthlyRevenue.totalRevenue > 0
            ? ((monthlyRevenue.totalRevenue - monthlyExpenses.totalExpenses) /
                monthlyRevenue.totalRevenue) *
              100
            : 0,
        averageMilkPerCow:
          totalCows > 0 ? (todayMilkProduction[0]?.total || 0) / totalCows : 0,
      },
    };
  }
}
