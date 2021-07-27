console.clear();
interface Observer {
  next: (value: any) => void;
  err: (err: any) => void;
  complete: () => void;
}
type TearDown = () => void;
const observer: Observer = {
  next: (value: any) => console.log('Next :', value),
  err: (err: any) => console.log('err :', err),
  complete: () => console.log('complete')
};

class Observable {
  subscriber: (observer: Observer) => TearDown;
  constructor(subscriber: (observer: Observable) => TearDown) {
    this.subscriber = subscriber;
  }
  subscribe(observer: Observer) {
    const teardown: TearDown = this.subscriber(observer);
    return { unsubscribe: () => teardown() };
  }
}

function Interval(millisec: number) {
  return new Observable(observer => {
    let i = 0;
    const index = setInterval(() => observer.next(i++), millisec);
    const teardown = () => clearInterval(index);
    return teardown;
  });
}

function of(...dataList: any[]) {
  return new Observable(observer => {
    dataList.forEach(data => observer.next(data));
    observer.complete();
    return () => {};
  });
}

function from(dataList:any[]) {
  return new Observable(observer => {
    dataList.forEach(data => observer.next(data));
    observer.complete();
    return () => {};
  });
}

//const source = Interval(2000);
//const source = of(10,20,30,40,50,60,70);
const source = from(['banana', 'old-banana', 'apple']);
const subscription = source.subscribe(observer);
setTimeout(() => {
  subscription.unsubscribe();
}, 5000);
