import { createCard, getCardData, getCardTransform, setCardTransform, updateCardData, updateCardTransform } from "../Card/Card.mjs"
import { GET_CARD_HEIGHT, GET_CARD_WIDTH } from "../Card/CardGraphicsAndSizes.mjs"
import { getCardDataAsync, getHandCardPosition } from "../Card/CardUtils.mjs"
import { BOARD_WIDTH, GET_BOARD_HEIGHT } from "./Board.mjs"
import { startDraggingMinion } from "./DraggableMinion.mjs"
import { getInfoCard, hideInfoCard, showInfoCard } from "./InfoCard.mjs"

export let currentlyClickedHandCard = null
export let setCurrentlyClickedHandCard = val => currentlyClickedHandCard = val
const getHandCardPositionsWithDefaults = (nCards) => getHandCardPosition(nCards, window.innerWidth / 2.5, window.innerHeight - GET_CARD_HEIGHT())
const getHandCards = () => Array.from(document.querySelector('.hand').children)

const CARD_POSES_BY_NUMBER = [
    null,
    getHandCardPositionsWithDefaults(1),
    getHandCardPositionsWithDefaults(2),
    getHandCardPositionsWithDefaults(3),
    getHandCardPositionsWithDefaults(4),
    getHandCardPositionsWithDefaults(5),
    getHandCardPositionsWithDefaults(6),
    getHandCardPositionsWithDefaults(7),
    getHandCardPositionsWithDefaults(8),
    getHandCardPositionsWithDefaults(9),
    getHandCardPositionsWithDefaults(10)
]

export async function addCardToHand(cardName) {
    const cardData = await getCardDataAsync(cardName)
    console.log(`Adding ${cardName}`)
    console.log({cardData})
    const card = createCard({x: BOARD_WIDTH * 0.9, y: GET_BOARD_HEIGHT() * 0.6, rotation: 0}, cardData, {
        cardScale: 1,
        onMouseEnter(cardDiv) {
            const { x, y } = getCardTransform(cardDiv)
            const cardData = getCardData(cardDiv)
            showInfoCard({ x: x - 100, y: y - 300, visibility: 'visible', zIndex: 'var(--card-info-z)' }, cardData)
            updateCardTransform(cardDiv, { isHovered: true, visibility: 'hidden' })
        },
        onMouseLeave(cardDiv) {
            hideInfoCard()
            updateCardTransform(cardDiv, { zIndex: null, isHovered: false, visibility: 'visible' })
        },
        onClick(cardDiv) {
            currentlyClickedHandCard = cardDiv
            startDraggingMinion(cardDiv)    // Stopping in Board.playCurrentlyClickedHandCard
        }
    })
    document.querySelector('.hand').appendChild(card)
}


function startAnimations() {
    setInterval(() => {
        const handCards = getHandCards()
        const positionsTheyShouldBe = CARD_POSES_BY_NUMBER[handCards.length]
        for (let i = 0; i < handCards.length; i++) {
            const card = handCards[i]
            const pos = positionsTheyShouldBe[i]
            const cardTransform = getCardTransform(card)
            const xDiff = cardTransform.x - pos.x
            const yDiff = cardTransform.y - pos.y
            const rDiff = cardTransform.rotation - pos.rotation
            const newX = cardTransform.x - xDiff * 0.35
            const newY = cardTransform.y - yDiff * 0.35
            const newR = cardTransform.rotation - rDiff * 0.35
            updateCardTransform(card, {
                x: newX,
                y: newY,
                rotation: newR
            })
        }
    }, 25)
}


export function setup() {
    startAnimations()
    
    addCardToHand('Bloodfen Raptor')
    addCardToHand('Maw and Paw')
    addCardToHand('Twilight Drake')
    addCardToHand('Ragnaros the Firelord')
    
    document.body.addEventListener('keypress', evt => {
        if (evt.code == 'Space') {
            addCardToHand('Imp')
        }
    })
}




