export interface Question {id:string;title:string;type?:string;optional?:boolean;max?:number;hint?:string;options?:string[];multi?:boolean;exclusive?:number[]}
export const questions:Question[];
export const excludedMessage:string;
export const successMessage:string;
export function hasOther(q:Question,value:unknown):boolean;
export function validate(input:unknown):{errors:Record<string,string>;data:Record<string,any>;state:'excluded'|'completed'};
