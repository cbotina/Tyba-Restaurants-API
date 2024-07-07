import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class Coordinates {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class SearchOptionsDto {
  @IsNumber()
  @IsNotEmpty()
  maxResultCount: number;

  @ValidateNested()
  @Type(() => Coordinates)
  @IsNotEmpty()
  coordinates: Coordinates;

  @IsNumber()
  @IsNotEmpty()
  radius: number;
}
