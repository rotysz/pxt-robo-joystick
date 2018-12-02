const CHANGE_STEP = 4

let InitX = 511
let InitY = 511
let Start = false
let FastTurn = false
let PrevSpeedL = 0
let PrevSpeedR = 0
let Speed = 0
let PosX = 0
let PosY = 0
let SpeedR = 0
let SpeedL = 0
let Gear = 1

radio.setGroup(2)
WSJoyStick.JoyStickInit()
DisplayGear(Gear, FastTurn)


function DisplayGear(Gear: number, FastTurn: boolean) {
    for (let i = 1; i <= 5; i++) {
        led.unplot(0, 5 - i)
        if (i <= Gear) led.plot(0, 5 - i)
        led.unplot(1, 0)
        if (FastTurn) led.plot(1, 0)
    }
}

WSJoyStick.onKey(KEY.C, function () {
    FastTurn = !FastTurn
    DisplayGear(Gear, FastTurn)
})

WSJoyStick.onKey(KEY.D, function () {
    if (Gear < 5) Gear++
    DisplayGear(Gear, FastTurn)
})

WSJoyStick.onKey(KEY.F, function () {
    if (Gear > 1) Gear--
    DisplayGear(Gear, FastTurn)
})


WSJoyStick.onKey(KEY.E, function () {
    InitX = pins.analogReadPin(AnalogPin.P1)
    InitY = pins.analogReadPin(AnalogPin.P2)
    Start = true
    Robot.Predkosc(0)
    Robot.DoPrzodu(60000)
})

function SpeedCalc(FastTurn: boolean, Speed: number, PosX: number): number {
    let NewSpeed = 0
    if (FastTurn)
        NewSpeed = Math.idiv(Speed - 2 * Speed * Math.abs(PosX / 256), CHANGE_STEP) * CHANGE_STEP
    else
        NewSpeed = Math.idiv(Speed - Speed * Math.abs(PosX / 256), CHANGE_STEP) * CHANGE_STEP
    return NewSpeed
}


basic.forever(function () {
    let jx = pins.analogReadPin(AnalogPin.P1)
    let jy = pins.analogReadPin(AnalogPin.P2)
    //   console.logValue("x", jx)
    //   console.logValue("y", jy)
    if (Start) {

        Speed = Math.idiv(jy - InitY, CHANGE_STEP * 2) * CHANGE_STEP
        Speed = Math.idiv(Speed, 6 - Gear)
        PosX = Math.idiv(jx - InitX, CHANGE_STEP * 2) * CHANGE_STEP
        if (PosX > 0) {
            SpeedL = Speed
            SpeedR = SpeedCalc(FastTurn, Speed, PosX)
        } else {
            SpeedR = Speed
            SpeedL = SpeedCalc(FastTurn, Speed, PosX)
        }
        Robot.ZmienPredkosc(SpeedL, SpeedR)

        if ((PrevSpeedR != SpeedR) || (PrevSpeedL != SpeedL)) {
            //    Robot.ZmienPredkosc(SpeedL, SpeedR)
            PrevSpeedL = SpeedL
            PrevSpeedR = SpeedR
            console.logValue("SpeedL", SpeedL)
            console.logValue("SpeedR", SpeedR)
        }

    }
    basic.pause(50)
}) 