



import { dom, drawCurvedTextBezier, drawImageOnCanvasAsync, getRelativePercent, drawText, arrayDiff } from '../lib/utils.mjs'
import { GET_CARD_FRAME_HEIGHT, GET_CARD_HEIGHT, GET_CARD_WIDTH, MINION_HEIGHT, MINION_WIDTH, createCardGraphicCanvas, createMinionGraphicCanvasAsync } from './CardGraphicsAndSizes.mjs'
import { areCoordsInCard } from './CardUtils.mjs'

export const GET_STAT_FONT_SIZE = () => 61 / 383 * GET_CARD_FRAME_HEIGHT()
export const GET_TEXT_FONT_SIZE = () => GET_CARD_FRAME_HEIGHT() * 0.043




export const EXAMPLE_CARD_DATA = {
	"id": "EX1_116",
	"dbfId": 559,
	"name": "Leeroy Jenkins",
	"text": "<b>Charge</b>. <b>Battlecry:</b> Summon two 1/1 Whelps for your opponent.",
	"flavor": "At least he has Angry Chicken.",
	"artist": "Gabe from Penny Arcade",
	"attack": 6,
	"cardClass": "NEUTRAL",
	"collectible": true,
	"cost": 5,
	"elite": true,
	"faction": "ALLIANCE",
	"health": 2,
	"mechanics": [
		"BATTLECRY",
		"CHARGE"
	],
	"rarity": "LEGENDARY",
	"set": "EXPERT1",
	"type": "MINION"
}

function setCardTextInnerHTML(cardDiv, text) {
    const innerHTML = text == null ? '' : text
        .split('[x]').join('')
        .split('<b>').join(`<span class="keyword" style="transform: translate(0, -${GET_TEXT_FONT_SIZE() / 15 * cardDiv.cardScale}px) scale(0.9, 1)">`)
        .split('</b>').join('</span>')
    cardDiv.querySelector('.text-box .text').innerHTML = innerHTML
    
}
export function getCardData(cardDiv) {
    return cardDiv.currentData
}
export function updateCardData(cardDiv, newData) {
    console.log(`Updating card data: ${newData.name}`)
    const oldCardData = getCardData(cardDiv)
    cardDiv.currentData = newData
    if (oldCardData != null && oldCardData.name != newData.name) {
        if (cardDiv.classList.contains('minion')) {
            setupMinionGraphics(cardDiv, newData, )
        } else {
            setupCardGraphics(cardDiv, newData, cardDiv.cardScale)
        }
    }
    if (cardDiv.querySelector('.text') != null)
        setCardTextInnerHTML(cardDiv, newData.text)
    if (cardDiv.querySelector('.mana') != null)
        cardDiv.querySelector('.mana').innerText = newData.cost
    if (cardDiv.querySelector('.attack') != null)
        cardDiv.querySelector('.attack').innerText = newData.attack
    if (cardDiv.querySelector('.health') != null)
        cardDiv.querySelector('.health').innerText = newData.health
}


export async function setupCardGraphics(cardDiv, cardData, cardScale = 1) {
    const graphicCanvas = await createCardGraphicCanvas(cardData, cardScale)
    const oldCanvas = cardDiv.querySelector('.card-graphic canvas')
    if (oldCanvas != null) {
        oldCanvas.remove()
    }
    cardDiv.querySelector('.card-graphic').appendChild(graphicCanvas)
}
export async function setupMinionGraphics(cardDiv, cardData) {
    const graphicCanvas = await createMinionGraphicCanvasAsync(cardData)
    const oldCanvas = cardDiv.querySelector('.card-graphic canvas')
    if (oldCanvas != null) {
        oldCanvas.remove()
    }
    cardDiv.querySelector('.card-graphic').appendChild(graphicCanvas)
}
export function createMinion(cardTransform, cardData, options) {
    if (options == null) options = {}
    const { onMouseEnter, onMouseLeave, onClick } = options
    const cardScale = options.cardScale == null? 1: options.cardScale

    const widthAndHeight = `
        width: ${MINION_WIDTH}px;
        height: ${MINION_HEIGHT}px
    `

    const cardDiv = dom(`
        <div class="minion" style="${widthAndHeight}">
            <div class="card-graphic" style="${widthAndHeight}">
                <div style="font-size: ${GET_STAT_FONT_SIZE()}px" class="card-stat attack"></div>
                <div style="font-size: ${GET_STAT_FONT_SIZE()}px" class="card-stat health"></div>
            </div>
        </div>
    `)

    cardDiv.originalCardData = cardData
    cardDiv.cardScale = cardScale



    setupMinionGraphics(cardDiv, cardData)
    setCardTransform(cardDiv, cardTransform)
    console.log('updating card data for ' + cardData.name)
    updateCardData(cardDiv, cardData)

    if (onMouseEnter != null)
        cardDiv.addEventListener('mouseenter', (evt) => { onMouseEnter(cardDiv) })
    if (onMouseLeave != null)
        cardDiv.addEventListener('mouseleave', (evt) => { onMouseLeave(cardDiv) })
    if (onClick != null)
        cardDiv.addEventListener('click', (evt) => { onClick(cardDiv) })

    return cardDiv
}
export function createCard(cardTransform, cardData, options) {

    if (options == null) options = {}
    const { onMouseEnter, onMouseLeave, onClick } = options
    const cardScale = options.cardScale == null? 1: options.cardScale

    const widthAndHeight = `
        width: ${GET_CARD_WIDTH() * cardScale}px;
        height: ${GET_CARD_HEIGHT() * cardScale}px
    `

    const cardDiv = dom(`
        <div class="card" style="${widthAndHeight}">
            <div class="card-graphic" style="${widthAndHeight}">
                <div style="font-size: ${GET_STAT_FONT_SIZE() * cardScale}px" class="card-stat mana"></div>
                <div style="font-size: ${GET_STAT_FONT_SIZE() * cardScale}px" class="card-stat attack"></div>
                <div style="font-size: ${GET_STAT_FONT_SIZE() * cardScale}px" class="card-stat health"></div>
                <div class="text-box" style="top: ${0.785 * GET_CARD_HEIGHT() * cardScale}">
                    <div style="font-size: ${GET_TEXT_FONT_SIZE() * cardScale}px; line-height: ${GET_TEXT_FONT_SIZE() * cardScale}px" class="text"></div>
                </div>
            </div>
        </div>
    `)

    cardDiv.originalCardData = cardData
    cardDiv.cardScale = cardScale

    setupCardGraphics(cardDiv, cardData, cardScale)
    setCardTransform(cardDiv, cardTransform)
    updateCardData(cardDiv, cardData)

    if (onMouseEnter != null)
        cardDiv.addEventListener('mouseenter', (evt) => { onMouseEnter(cardDiv) })
    if (onMouseLeave != null)
        cardDiv.addEventListener('mouseleave', (evt) => { onMouseLeave(cardDiv) })
    if (onClick != null)
        cardDiv.addEventListener('click', (evt) => { onClick(cardDiv) })

    return cardDiv
}


const zones = {}
export function addCardToZone(cardDiv, zoneClass, slotIndex) {
    zoneClass = zoneClass.split('.').join('')
    if (zones[zoneClass] == null) {
        zones[zoneClass] = []
    }
    zones[zoneClass].push(cardDiv)
    cardDiv.zone = zoneClass

    const zoneDiv = document.querySelector('.' + zoneClass)
    if (slotIndex != null && zoneDiv.children.length > 0) {
        zoneDiv.insertBefore(cardDiv, zoneDiv.childNodes[slotIndex]);
    } else {
        zoneDiv.appendChild(cardDiv)
    }
    
}
export function removeCardFromZone(cardDiv) {
    const { zone } = cardDiv
    zones[zone] = zones[zone].filter(div => div != cardDiv)
    cardDiv.zone = null
    cardDiv.remove()
    return cardDiv
}

let cardsBeingHovered = []
export function setup() {

    function forEachCardInEachZone(callback) {
        const allZonesRegistered = Object.keys(zones)
        for (const zoneName of allZonesRegistered) {
            const allCardsInZone = zones[zoneName]
            for (const cardDiv of allCardsInZone) {
                callback(cardDiv, zoneName)
            }
        }
    }

    document.querySelector('.board').addEventListener('mousemove', ({ clientX, clientY }) => {
        const cardsHoveredOverNow = []
        forEachCardInEachZone((cardDiv, zoneName) => {
            if (areCoordsInCard(cardDiv, { x: clientX, y: clientY })) {
                cardsHoveredOverNow.push(cardDiv)
            }
        })
        const { left, both, right} = arrayDiff(cardsBeingHovered, cardsHoveredOverNow)
        const cardsNoLongerHovered = left
        const cardsNewlyHovered = right
        cardsBeingHovered = cardsHoveredOverNow
        console.log({ left, both, right})
    })
}

// Works on minionDiv as well
export function getCardTransform(cardDiv) {
    if (cardDiv.style == null) {
        console.log('ERROR: Card null style:')
        console.log(cardDiv)
    }
    const currentVisibility = cardDiv.querySelector('.card-graphic').style.visibility
    return {
        x: parseFloat(cardDiv.style.left),
        y: parseFloat(cardDiv.style.top),
        zIndex: cardDiv.style['z-index'],
        rotation: parseFloat(cardDiv.getAttribute('rotation')),
        isHovered: cardDiv.getAttribute('isHovered') == 'true'? true: false,
        visibility: currentVisibility == null? 'visible': currentVisibility
    }
}
// Works on minionDiv as well
export function setCardTransform(cardDiv, { x, y, rotation, zIndex, isHovered, visibility }) {
    cardDiv.style.left = x != null? x + 'px': '0px'
    cardDiv.style.top = y != null? y + 'px': '0px'
    cardDiv.style['z-index'] = zIndex != null? zIndex: null
    cardDiv.querySelector('.card-graphic').style.transform = rotation != null? `rotate(${rotation}deg)`: null
    cardDiv.setAttribute('rotation', rotation)
    cardDiv.setAttribute('isHovered', isHovered == true? true: false)
    cardDiv.querySelector('.card-graphic').style.visibility = visibility
}
// Works on minionDiv as well
export function updateCardTransform(cardDiv, statePart) {
    setCardTransform(cardDiv, {
        ...getCardTransform(cardDiv),
        ...statePart
    })
}













