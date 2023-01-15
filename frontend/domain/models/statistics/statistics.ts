export class UserItemDoneCount {
  constructor(
    public username: string,
    public done: number
  ) {}

  toObject(): Object {
    return {
      username: this.username,
      done: this.done
    }
  }
}

export class AllUsersItemDoneCount {
  constructor(
    public total: number
  ) {}

  toObject(): Object {
    return {
      total: this.total
    }
  }
}

export class DailyAverageTime {
  constructor(
    public date: string,
    public averageTimeInSeconds: number
  ) {}

  toObject(): Object {
    return {
      date: this.date,
      averageTimeInSeconds: this.averageTimeInSeconds
    }
  }
}

export class UserAverageTime {
  constructor(
    public userId: number,
    public meanTimeInSeconds: number,
    public dailyAverageTime: DailyAverageTime[]
  ) {}

  toObject(): Object {
    return {
      userId: this.userId,
      meanTimeInSeconds: this.meanTimeInSeconds,
      dailyAverageTime: this.dailyAverageTime
    }
  }
}

export class AllUsersAverageTime {
  constructor(
    public meanTimeInSeconds: number,
    public dailyAverageTime: DailyAverageTime[]
  ) {}

  toObject(): Object {
    return {
      meanTimeInSeconds: this.meanTimeInSeconds,
      dailyAverageTime: this.dailyAverageTime
    }
  }
}
