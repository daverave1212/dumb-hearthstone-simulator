import { dom, expoIn, expoOut, lerpPercent, radiansToDegrees } from "../lib/utils.mjs"


const SLAM_HEIGHT = 175
const SLAM_WIDTH = SLAM_HEIGHT


export function slam(from, to, callback) {
    from.x = from.x - SLAM_WIDTH / 2
    from.y = from.y - SLAM_HEIGHT / 2
    to.x = to.x - SLAM_WIDTH / 2
    to.y = to.y - SLAM_HEIGHT / 2

    const tickTime = 15
    const nTicks = 35
    const duration = tickTime * nTicks

    const yDiff = to.y - from.y
    const yTick = yDiff / nTicks

    const middleX =
        from.y > to.y? (
            from.x > to.x? from.x + 100: (to.x + 100)
        ): (
            from.x < to.x? from.x - 100: (to.x - 100)
        )
    const middleXDiff = middleX - from.x
    const middleXNormalTick = middleXDiff / (nTicks / 2)
    const toXDiff = to.x - middleX
    const toXNormalTick = toXDiff / (nTicks / 2)

    const startAngle = radiansToDegrees(Math.atan2(-yDiff/2, middleXDiff))
    console.log({yDiff, middleXDiff, startAngle})
    const middleAngle = yDiff <= 0? 90 : -90
    const endAngle = radiansToDegrees(Math.atan2(-yDiff/4, toXDiff))
    console.log({yDiff4: -yDiff/4, toXDiff})

    const particle = dom(`
        <div class="effect" style="width: ${SLAM_WIDTH}px">
            <img src="/assets/effects/slam.png">
        </div>
    `)
    document.querySelector('.board').appendChild(particle)

    let ticksSoFar = 0
    let x = from.x
    let y = from.y
    let angle = startAngle
    let interval
    interval = setInterval(() => {

        if (ticksSoFar == nTicks) {
            clearInterval(interval)
            particle.remove()
            return
        }

        y += yTick

        if (ticksSoFar <= nTicks / 2) {
            const normalX = from.x + middleXNormalTick * ticksSoFar
            const newX = lerp(from.x, middleX, normalX, expoIn)
            const newAngle = lerpPercent(startAngle, middleAngle, ticksSoFar * tickTime / (duration / 2), val => val)
            angle = newAngle
            x = newX
        } else {
            const normalX = middleX + toXNormalTick * (ticksSoFar - nTicks / 2)
            const newX = lerp(middleX, to.x, normalX, expoOut)
            const newAngle = lerpPercent(middleAngle, endAngle, (ticksSoFar * tickTime / duration - 0.5) * 2, val => val)
            // console.log(`newAngle = lerpPercent(0, ${endAngle}, ${(ticksSoFar * tickTime / duration - 0.5) * 2})`)
            // console.log(ticksSoFar * tickTime / duration)
            angle = newAngle
            x = newX
        }

        particle.style.left = x + 'px'
        particle.style.top = y + 'px'
        particle.style.transform = `rotate(${-angle}deg)`

        ticksSoFar++
    }, tickTime)
}