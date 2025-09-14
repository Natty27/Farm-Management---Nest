import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum CowStatus {
  ACTIVE = 'active',
  SICK = 'sick',
  DRY = 'dry',
  SOLD = 'sold',
  DEAD = 'dead',
}

@Schema()
export class Cow {
  @Prop({ required: true })
  name: String;

  @Prop({ required: false })
  breed: String;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({
    type: String,
    enum: CowStatus,
    default: CowStatus.ACTIVE,
  })
  status: CowStatus;
}

export const CowSchema = SchemaFactory.createForClass(Cow);
