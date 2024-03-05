export default function HowToPlay() {
    return <>
        <p className="text-4xl text-center py-4">How to Play</p>
        <div className="px-8 py-2 m-2 border-2 border-black rounded-xl bg-floral-white text-lg">
            <ul className="list-disc">
                <li>
                    Sign up/in from the nav bar above.
                </li>
                <li>
                    Authenticated users can edit a shared deck of cards, create a game with the cards that currently exist,
                    take over games they&apos;ve created (in case they clear site data, and lose their superuser status),
                    or delete games they&apos;ve created.  They can also generate join/play links for games.  The superuser/owner
                    of a game (the original player created when the game is created) can kick out other users.
                </li>
                <li>
                    Anyone can join and participate in a game, with a link from an authenticated user.
                </li>
                <li>
                    To play, create a game, send the link to your friends, and use your favorite voice chat application to
                    connect to them.  In any order you please, draw cards from the deck, and try to elicit the top word on the
                    card from the other players, without saying any of the words on the card.
                </li>
                <li>
                    The original version of this game had a team scoring mechanism, but the price of that style of play is that
                    only 50% of the players are actually participating at any given time, and the absolute minimum number of players
                    is four. Since Taboo is a fairly high-trust game, I basically never play it with points, and this implementation
                    reflects that house rule.
                </li>
            </ul>
        </div>
    </>;
}