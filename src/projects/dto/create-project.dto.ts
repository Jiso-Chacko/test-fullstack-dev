import {IsString, IsNotEmpty, IsArray, IsInt, IsOptional} from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsArray()
    @IsOptional()
    @IsInt({ each: true })
    @Type(() => Number)
    @Transform((value) => value  || [])
    userIds: number[] = [];
}
