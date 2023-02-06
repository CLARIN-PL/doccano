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
    public averageTimeInMinutes: number
  ) {}

  toObject(): Object {
    return {
      date: this.date,
      averageTimeInMinutes: this.averageTimeInMinutes
    }
  }
}

export class UserAverageTime {
  constructor(
    public userId: number,
    public meanTimeInMinutes: number,
    public dailyAverageTime: DailyAverageTime[]
  ) {}

  toObject(): Object {
    return {
      userId: this.userId,
      meanTimeInMinutes: this.meanTimeInMinutes,
      dailyAverageTime: this.dailyAverageTime
    }
  }
}

export class AllUsersAverageTime {
  constructor(
    public meanTimeInMinutes: number,
    public dailyAverageTime: DailyAverageTime[]
  ) {}

  toObject(): Object {
    return {
      meanTimeInMinutes: this.meanTimeInMinutes,
      dailyAverageTime: this.dailyAverageTime
    }
  }
}
