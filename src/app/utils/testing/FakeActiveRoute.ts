import { Subject } from "rxjs";

export class FakeActivatedRoute {
    private subject = new Subject();

    push(value: any) {
        this.subject.next(value);
    }

    get params() {
        return this.subject.asObservable();
    }

}