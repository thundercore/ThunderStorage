import { QuestionTypes } from './questionTypes'

export class IChoiceResponse {
  value: string
  selected: boolean
  comment?: string
}

export class IMultipleChoiceField {
  questionType: QuestionTypes.MultipleChoice
  question: string
  response: IChoiceResponse[]
}

export class IFreeResponse {
  value: string
  comment?: string
}

export class IFreeResponseField {
  questionType: QuestionTypes.FreeResponse
  question: string
  response: IFreeResponse
}

export type IQuestionField = IMultipleChoiceField | IFreeResponseField

export class ISurvey {
  title: string
  name?: string
  questions: IQuestionField[]
}
