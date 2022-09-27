# Constant Sum

- Price of token is based on (x + y = k)
    1. x = amount of token A in AMM

    2. y = Amount of token B in AMM

    3. k = Price of token

ex. Sell TokenA, Buy Token B

    a. dx = Amount of TokenA in
    b. dy = Amount of TokenB out

(Do Pandas Viz Here)

How Many Tokens are returned in a swap? Token a to Token b

    a. Before the trade = (x + y = k)
    b. after the trade = (x + dx + y + dy = k)
        a. (x + dx + y - dy = x + y)
        b. (dx - dy = 0)
        c. (dx = dy)
    c. The amount of token A must have the same value of token B

How Many Shares to mint

    a = amount in (a = dx + dy)
    l = liquidtiy before add (l = x + y)
    s = amount of shares to mint
    t = total shares before mint
    Increase is proportional to increase in total shares
    (l + a / l) = (t + s / t) 
        => s = (a * T / l)
        => s = (dx + dy)T / x + y)


How Many Take back When Remove

    a = amount in (a = dx + dy)
    l = liquidtiy before add (l = x + y)
    s = amount of shares to burn
    t = total shares before mint

    (a / l) = (s / t) 
        => a = (ls/t)
        => (dy + dy) = (xs / t) + (ys / t)