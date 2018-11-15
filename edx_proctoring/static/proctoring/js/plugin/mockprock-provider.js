import MockProctoringEventHandler from 'mockprock';

const handler = new MockProctoringEventHandler();

self.addEventListener("message", (message) => {
  switch(message.data.type) {
    case 'startExam': {
      return handler.onStartExam().then(() => self.postMessage({type: 'examStarted'}))
    }
    case 'endExam': {
      return handler.onEndExam().then(() => self.postMessage({type: 'examEnded'}))
    }
    case 'ping': {
      return handler.onPing().then(() => self.postMessage({type: 'echo'}))
    }
  }
});
