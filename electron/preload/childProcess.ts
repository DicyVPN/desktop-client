import type {ChildProcessWithoutNullStreams} from "child_process";

let child: ChildProcessWithoutNullStreams | null;


export function getChild (){
    return child;
}

export function setChild (process : ChildProcessWithoutNullStreams | null){
    child = process
}