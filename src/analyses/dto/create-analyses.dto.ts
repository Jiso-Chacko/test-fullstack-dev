import { IsString, IsNotEmpty } from "class-validator";

export class CreateAnalysesDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}