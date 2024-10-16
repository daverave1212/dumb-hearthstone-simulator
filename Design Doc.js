function getHandCardPositions(nCards) {
    return [        ]
}


function showHandCardInfoPopup(cardDiv) {
    setInfoPopupCardState(getCardState(cardDiv))
    const {x, y} = getCardState(cardDiv)
    setInfoPopupXY(x, y - 400)
}


function onHandCardMouseEnter(cardDiv) {
    getHandCards().forEach(cDiv => showCardGraphic(cDiv))
    hideCardGraphic(cardDiv)
    showHandCardInfoPopup(cardDiv)
}
function onHandCardMouseLeave(cardDiv) {
    getHandCards().forEach(cDiv => showCardGraphic(cDiv))
    hideInfoPopup()
}


`
    <div onmouseenter="onHandCardMouseEnter(event.target); event.stopPropagation()">
            
    <div>
`