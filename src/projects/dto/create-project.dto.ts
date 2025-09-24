import {IsString, IsNotEmpty, IsArray, IsInt, IsOptional} from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    userIds?: number[];
}
