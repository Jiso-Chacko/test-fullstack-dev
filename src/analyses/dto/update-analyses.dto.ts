import { PartialType } from "@nestjs/mapped-types";
import { CreateAnalysesDto } from "./create-analyses.dto";

export class UpdateAnalysesDto extends PartialType(CreateAnalysesDto) {}