import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested
} from 'class-validator'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

enum QuestionTypes {
  MultipleChoice = 'multiple-choice',
  FreeResponse = 'free-response'
}

class ChoiceResponse {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  public readonly value: string

  @ApiModelProperty()
  @IsBoolean()
  public readonly selected: boolean

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly comment?: string
}

class MultipleChoiceField {
  @ApiModelProperty({ enum: [QuestionTypes.MultipleChoice] })
  @IsNotEmpty()
  @IsString()
  public readonly questionType: QuestionTypes.MultipleChoice

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  public readonly question: string

  @ApiModelProperty({ type: ChoiceResponse, isArray: true })
  @ValidateNested()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => ChoiceResponse)
  public readonly response: ChoiceResponse[]
}

class FreeResponse {
  @IsNotEmpty()
  @IsString()
  public readonly value: string

  @IsOptional()
  @IsString()
  public readonly comment?: string
}
//
// class FreeResponseField {
//   @IsNotEmpty()
//   @IsString()
//   public readonly questionType: QuestionTypes.FreeResponse
//
//   @IsNotEmpty()
//   @IsString()
//   public readonly question: string
//
//   @ValidateNested()
//   @IsNotEmpty()
//   public readonly response: FreeResponse
// }
//
// type QuestionField = MultipleChoiceField | FreeResponseField

export class IVoterSavePoll {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  public readonly title: string

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly respondent?: string

  @ApiModelProperty({ type: MultipleChoiceField, isArray: true })
  @ValidateNested()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => MultipleChoiceField)
  public readonly questions: MultipleChoiceField[]
}

export default { IVoterSavePoll }
