import { drawCurvedTextBezier, drawImageOnCanvasAsync } from "../lib/utils.mjs"

export const ORIGINAL_CARD_FRAME_WIDTH = 527
export const ORIGINAL_CARD_FRAME_HEIGHT = 793

export const GET_CARD_HEIGHT = () => window.innerHeight * 0.22
export const GET_CARD_WIDTH = () => GET_CARD_HEIGHT() * 0.71
export const GET_CARD_FRAME_PADDING_LEFT = () => GET_CARD_WIDTH() * (17/258)
export const GET_CARD_FRAME_PADDING_RIGHT = () => GET_CARD_WIDTH() * (7/258)
export const GET_CARD_FRAME_WIDTH = () => GET_CARD_WIDTH() - GET_CARD_FRAME_PADDING_LEFT() - GET_CARD_FRAME_PADDING_RIGHT()
export const GET_CARD_FRAME_HEIGHT = () => GET_CARD_HEIGHT() * (358/363)


export const GET_NAME_BANNER_WIDTH = () => GET_CARD_FRAME_WIDTH() * 0.92
export const GET_NAME_BANNER_Y = () => GET_CARD_HEIGHT() * 0.475
export const GET_NAME_BANNER_X = () => GET_CARD_FRAME_PADDING_LEFT() + (GET_CARD_FRAME_WIDTH() - GET_NAME_BANNER_WIDTH()) / 2

export const GET_ATTACK_WIDTH = () => GET_CARD_FRAME_WIDTH() * 0.292
export const GET_ATTACK_HEIGHT = () => GET_CARD_FRAME_HEIGHT() * 0.218
export const GET_HEALTH_WIDTH = () => GET_CARD_FRAME_WIDTH() * 0.206
export const GET_HEALTH_HEIGHT = () => GET_CARD_FRAME_HEIGHT() * 0.206

export const MANA_WIDTH = GET_CARD_FRAME_WIDTH() * 0.265
export const MANA_Y = GET_CARD_HEIGHT() * 0.03



export const MINION_ORIGINAL_WIDTH = 376
export const MINION_ORIGINAL_HEIGHT = 486
export const MINION_HEIGHT = 0.14 * window.innerHeight
export const MINION_WIDTH = MINION_ORIGINAL_WIDTH / MINION_ORIGINAL_HEIGHT * MINION_HEIGHT
export const MINION_PADDING_LEFT = MINION_WIDTH * 0.02
export const MINION_PADDING_RIGHT = 0
export const MINION_FRAME_WIDTH = MINION_WIDTH - MINION_PADDING_LEFT - MINION_PADDING_RIGHT
export const MINION_FRAME_HEIGHT = MINION_HEIGHT

export async function createMinionGraphicCanvasAsync(cardData) {
    const canvas = document.createElement('canvas')
    canvas.width = MINION_WIDTH
    canvas.height = MINION_HEIGHT

    const imageUrl = 'https://art.hearthstonejson.com/v1/256x/' + cardData.id + '.jpg'
    await drawImageOnCanvasAsync({
        canvas,
        pathOrImage: imageUrl, 
        x: -MINION_WIDTH / 6, y: 0,
        height: MINION_HEIGHT,
        crop: {
            centerX: MINION_PADDING_LEFT + MINION_FRAME_WIDTH / 2,
            centerY: MINION_FRAME_HEIGHT / 2,
            width: MINION_FRAME_WIDTH * 0.9,    // Not sure why but it won't fit perfectly otherwise
            height: MINION_FRAME_HEIGHT,
            type: 'circle'
        }
    })
    await drawImageOnCanvasAsync({
        canvas, 
        pathOrImage: '/assets/minion-frame-board.png',
        x: MINION_PADDING_LEFT, y: 0, width: MINION_FRAME_WIDTH, height: MINION_FRAME_HEIGHT
    })
    await drawImageOnCanvasAsync({
        canvas,
        pathOrImage: '/assets/attack-minion.png',
        x: 0, y: MINION_HEIGHT - GET_ATTACK_HEIGHT(), width: GET_ATTACK_WIDTH()
    })
    await drawImageOnCanvasAsync({
        canvas,
        pathOrImage: '/assets/health.png',
        x: MINION_WIDTH - GET_HEALTH_WIDTH(), y: MINION_HEIGHT - GET_HEALTH_HEIGHT(), width: GET_HEALTH_WIDTH()
    })
    return canvas
}

export async function createCardGraphicCanvas(cardData, cardScale = 1) {
    const canvas = document.createElement('canvas')
    canvas.width = GET_CARD_WIDTH() * cardScale
    canvas.height = GET_CARD_HEIGHT() * cardScale

    const imageUrl = 'https://art.hearthstonejson.com/v1/256x/' + cardData.id + '.jpg'
    const config = {
        cardScale,
        canvas,
        pathOrImage: imageUrl, 
        x: (GET_CARD_FRAME_PADDING_LEFT() + GET_CARD_FRAME_WIDTH() * 0.1) * cardScale,
        y: 0,
        width: GET_CARD_FRAME_WIDTH() * 0.8 * cardScale,
        crop: {
            centerX: GET_CARD_FRAME_PADDING_LEFT() + GET_CARD_FRAME_WIDTH() / 2 * cardScale,
            centerY: 235 / ORIGINAL_CARD_FRAME_HEIGHT * GET_CARD_FRAME_HEIGHT() * cardScale,
            width: MINION_WIDTH * cardScale,
            height: 470 / ORIGINAL_CARD_FRAME_HEIGHT * GET_CARD_FRAME_HEIGHT() * cardScale,
            type: 'circle'
        }
    }
    await drawImageOnCanvasAsync(config)
    await drawImageOnCanvasAsync({
        canvas, 
        pathOrImage: '/assets/frame-minion-neutral.png',
        x: GET_CARD_FRAME_PADDING_LEFT() * cardScale,
        y: 0 * cardScale,
        width: GET_CARD_FRAME_WIDTH() * cardScale,
        height: GET_CARD_FRAME_HEIGHT() * cardScale
    })
    await drawImageOnCanvasAsync({
        canvas, 
        pathOrImage: '/assets/name-banner-minion.png',
        x: GET_NAME_BANNER_X() * cardScale,
        y: GET_NAME_BANNER_Y() * cardScale,
        width: GET_NAME_BANNER_WIDTH() * cardScale
    })
    await drawImageOnCanvasAsync({
        canvas,
        pathOrImage: '/assets/cost-mana.png',
        x: 0,
        y: MANA_Y * cardScale,
        width: MANA_WIDTH * cardScale
    })
    if (cardData.type == 'MINION') {
        await drawImageOnCanvasAsync({
            canvas,
            pathOrImage: '/assets/attack-minion.png',
            x: 0,
            y: (GET_CARD_HEIGHT() - GET_ATTACK_HEIGHT()) * cardScale,
            width: GET_ATTACK_WIDTH() * cardScale
        })
        await drawImageOnCanvasAsync({
            canvas,
            pathOrImage: '/assets/health.png',
            x: (GET_CARD_WIDTH() - GET_HEALTH_WIDTH()) * cardScale,
            y: (GET_CARD_HEIGHT() - GET_HEALTH_HEIGHT()) * cardScale,
            width: GET_HEALTH_WIDTH() * cardScale
        })
    }

    const titleFontSize = GET_CARD_HEIGHT() / 19 * cardScale
    const proposedStrokeSize = Math.floor(titleFontSize / 2.5 * cardScale)
    const strokeSize = proposedStrokeSize > 6? 6: proposedStrokeSize
    const titleY = GET_CARD_HEIGHT() * 0.58 * cardScale

    drawCurvedTextBezier(canvas, {
        // isDebug: true,
        text: cardData.name,
        font: `${titleFontSize}px TitleFont`,
        color: 'white',
        strokeColor: 'black',
        strokeSize: strokeSize,
        rotationModifier: function(rotation) {
            if (rotation > 0.25) {
                return 0.25
            }
            if (rotation < -0.25) {
                return -0.25
            }
            return rotation
        },

        maxChar: 50,
        startX: GET_CARD_WIDTH() * 0.15 * cardScale,
        startY: titleY,
        control1X: GET_CARD_WIDTH() * 0.29 * cardScale,
        control1Y: titleY + GET_CARD_HEIGHT() * 0.02 * cardScale,
        control2X: GET_CARD_WIDTH() * 0.6 * cardScale,
        control2Y: titleY - GET_CARD_HEIGHT() / 11 * cardScale,
        endX: GET_CARD_WIDTH() * 0.9 * cardScale,
        endY: GET_CARD_HEIGHT() * 0.56 * cardScale
    })

    return canvas
}













