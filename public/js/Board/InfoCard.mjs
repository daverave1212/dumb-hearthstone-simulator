import { createCard, updateCardData, updateCardTransform } from "../Card/Card.mjs"
import { getCardDataAsync } from "../Card/CardUtils.mjs"
import { BOARD_WIDTH, GET_BOARD_HEIGHT } from "./Board.mjs"

export const GET_MINION_INFO_X = () => BOARD_WIDTH * 0.1
export const GET_MINION_INFO_Y = () => GET_BOARD_HEIGHT() * 0.2

export async function setupAsync() {
    const div = document.querySelector('.info-card')
    const cardData = await getCardDataAsync('Leper Gnome')
    const placeholderCard = createCard({}, cardData, { cardScale: 1.35 })
    div.appendChild(placeholderCard)
    updateCardTransform(placeholderCard, { visibility: 'hidden' })
    console.log(getInfoCard())
}

export function getInfoCard() {
    return document.querySelector('.info-card .card')
}
export function showInfoCard(cardTransform, cardData) {
    if (cardTransform.visibility == null) {
        cardTransform.visibility = 'visible'
    }
    const cardDiv = getInfoCard()
    updateCardTransform(cardDiv, cardTransform)
    updateCardData(cardDiv, cardData)
    getInfoCard().querySelector('.card-graphic').classList.add('appearing')
}
export function hideInfoCard() {
    updateCardTransform(getInfoCard(), { x: GET_MINION_INFO_X(), y: GET_MINION_INFO_Y(), visibility: 'hidden' })
    getInfoCard().querySelector('.card-graphic').classList.remove('appearing')
}
