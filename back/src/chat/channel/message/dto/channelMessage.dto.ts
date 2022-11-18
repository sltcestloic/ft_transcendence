import { IsNotEmpty, isNumber, IsNumber, IsString } from "class-validator";

export class ChannelMessageDto {

	@IsNotEmpty()
	@IsString()
	content: string;

	@IsNotEmpty()
	@IsNumber()
	chanId: number;
}

export class SkipDto {
	@IsNumber()
	skip: number;
}