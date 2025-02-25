import { Subject } from "rxjs";

export class AnotherActivatedRouterStub{
    private subject = new Subject<any>();
    public params = this.subject.asObservable();
    pushParams(params: any) {
        this.subject.next(params);
    }
}
