
import { addCardToZone, createMinion, getCardData, getCardTransform, removeCardFromZone, updateCardTransform } from "../Card/Card.mjs";
import { MINION_WIDTH, createMinionGraphicCanvasAsync } from "../Card/CardGraphicsAndSizes.mjs";
import { getCardDataAsync } from "../Card/CardUtils.mjs";
import { slam } from "../Effects/Effects.mjs";
import { stopDraggingMinion } from "./DraggableMinion.mjs";
import { currentlyClickedHandCard, setCurrentlyClickedHandCard } from "./Hand.mjs";
import { GET_MINION_INFO_X, GET_MINION_INFO_Y, getInfoCard, hideInfoCard, showInfoCard } from "./InfoCard.mjs";

export const BOARD_WIDTH = window.innerWidth
export const GET_BOARD_HEIGHT = () => window.innerHeight
export const BOARD_CARD_PADDING = MINION_WIDTH / 4


export const getMinionsByBoardClass = (divClass) => Array.from(document.querySelector(divClass).children)
export const getFriendlyMinions = () => Array.from(document.querySelector('.friendly-minions').children)
export const getEnemyMinions = () => Array.from(document.querySelector('.enemy-minions').children)

let mouseXInBoard = null
document.querySelector('.friendly-minions').addEventListener('mousemove', (evt) => { mouseXInBoard = evt.clientX })
document.querySelector('.friendly-minions').addEventListener('mouseleave', (evt) => { mouseXInBoard = null })
document.querySelector('.enemy-minions').addEventListener('mousemove', (evt) => { mouseXInBoard = evt.clientX })
document.querySelector('.enemy-minions').addEventListener('mouseleave', (evt) => { mouseXInBoard = null })

function getMinionsXByNCards(nCards) {
    if (nCards == 0) return []
    
    const boardCenterX = BOARD_WIDTH / 2 - MINION_WIDTH / 2
    const totalCardsWidth = nCards * MINION_WIDTH + (nCards - 1) * BOARD_CARD_PADDING
    const startX = boardCenterX - totalCardsWidth / 2
    const xs = []
    for (let i = 0; i < nCards; i++) {
        const x = startX + i * MINION_WIDTH + i * BOARD_CARD_PADDING
        xs.push(x)
    }

    return xs
}
function getMinionSlotByX(nCards, x) {
    if (x == null) return null
    const boardCenterX = BOARD_WIDTH / 2 - MINION_WIDTH / 2
    const totalCardsWidth = nCards * MINION_WIDTH + (nCards - 1) * BOARD_CARD_PADDING
    const startX = boardCenterX - totalCardsWidth / 2
    const endX = startX + totalCardsWidth
    if (x < startX || x > endX) return null
    const xNoOffset = x - startX
    const cardSlotIndexWithPadding = Math.floor(xNoOffset / (MINION_WIDTH + BOARD_CARD_PADDING))
    return cardSlotIndexWithPadding
}
function getMinionPositionsWhereShouldBe(mouseXInBoard) {
    const cardsOnBoard = getFriendlyMinions()
    
    if (mouseXInBoard == null) {
        return getMinionsXByNCards(cardsOnBoard.length)
    }

    const mouseSlotIndex = getMinionSlotByX(cardsOnBoard.length + 1, mouseXInBoard)
    const normalSlotPositions = getMinionsXByNCards(cardsOnBoard.length + 1)
    let currentSlotPosIndex = 0
    const minionPositionsWhereShouldBe = []
    for (let i = 0; i < cardsOnBoard.length; i++) {
        if (mouseSlotIndex == i) {
            currentSlotPosIndex++
        }
        minionPositionsWhereShouldBe.push(normalSlotPositions[currentSlotPosIndex])
        currentSlotPosIndex++
    }
    return minionPositionsWhereShouldBe
}
function tickMinionsInBoardTowardsPositions() {
    const cardDivs = getMinionsByBoardClass('.friendly-minions')
    const isAnyCardBeingDragged = currentlyClickedHandCard != null
    const xs = isAnyCardBeingDragged? getMinionPositionsWhereShouldBe(mouseXInBoard): getMinionsXByNCards(cardDivs.length)
    cardDivs.forEach((card, i) => {
        const cardTransform = getCardTransform(card)
        const posX = xs[i]
        const xDiff = cardTransform.x - posX
        const newX = cardTransform.x - xDiff * 0.35
        updateCardTransform(card, { x: newX })
    })
}

function playCurrentlyClickedHandCard() {
    stopDraggingMinion()
    removeCardFromZone(currentlyClickedHandCard)
    const cardDivs = getMinionsByBoardClass('.friendly-minions')
    const slotIndex = getMinionSlotByX(cardDivs.length + 1, mouseXInBoard)
    addMinionToBoard('friendly-minions', getCardData(currentlyClickedHandCard), slotIndex)
    setCurrentlyClickedHandCard(null)
}



export function addMinionToBoard(friendlyOrEnemy, cardData, slotIndex=0) {
    const card = createMinion({}, cardData, {
        onMouseEnter(cardDiv) {
            showInfoCard({ x: GET_MINION_INFO_X(), y: GET_MINION_INFO_Y() }, getCardData(cardDiv))
        },
        onMouseLeave(cardDiv) {
            hideInfoCard()
        }
    })
    addCardToZone(card, friendlyOrEnemy, slotIndex)
}

export function setup() {
    setInterval(() => {
        tickMinionsInBoardTowardsPositions()
    }, 25)

    document.querySelector('.friendly-minions').addEventListener('click', evt => {
        mouseXInBoard = evt.clientX
        if (currentlyClickedHandCard != null) {
            playCurrentlyClickedHandCard()
        }
    })

    document.body.addEventListener('keypress', async (evt) => {
        if (evt.code == 'KeyB') {
            console.log('addin')
            const cardData = await getCardDataAsync('Chillwind Yeti')
            console.log('oka...')
            addMinionToBoard('friendly-minions', cardData)
            console.log('done')
        }
    
        if (evt.code == 'KeyE') {
            slam({x: 600, y: 100}, {x: 800, y: 600})
        }
    })
}






