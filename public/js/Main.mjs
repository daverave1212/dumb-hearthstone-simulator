import * as Board from "./Board/Board.mjs";
import * as DraggableMinion from "./Board/DraggableMinion.mjs";
import * as Hand from "./Board/Hand.mjs";
import * as InfoCard from "./Board/InfoCard.mjs";
import * as Card from "./Card/Card.mjs";


async function main() {
    await InfoCard.setupAsync()
    await DraggableMinion.setupAsync()
    Card.setup()
    Hand.setup()
    Board.setup()
}

main()