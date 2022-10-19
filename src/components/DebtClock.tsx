import React from "react"

import { Box, Text, Flex } from "@chakra-ui/react"
import { toWords } from "number-to-words"
import { BTC_SUPPLY, US_POPULATION, US_TAXPAYER_POPULATION } from "core/constants"

const TotalDebt = ({ amount, ...rest }) => {
  const usDebtString = `$${Math.trunc(amount).toLocaleString()}`

  return (
    <Box position="relative" overflow="hidden" {...rest}>
      <Box bg="brand.yellow" display="inline-block" px={2}>
        <Text color="black" fontWeight="bold" fontSize={18} position="relative" zIndex={3}>
          Total US National Debt
        </Text>
      </Box>

      <Text
        color="brand.orange"
        fontSize={56}
        fontWeight={800}
        lineHeight={1}
        letterSpacing="-.8px"
        mt={3}
      >
        {toWords(Math.round(amount / 1000000) * 1000000).split("trillion")[0] + " trillion"} dollars
      </Text>

      <Box my={2} position="relative" w="100%">
        <Text
          sx={{
            fontSize: 24,
            fontWeight: 500,
            whiteSpace: "normal",
            display: "inline",
            lineHeight: 1,
            letterSpacing: "2px",
            wordBreak: "break-word",
            zIndex: 2,
            position: "relative",
          }}
        >
          {usDebtString}
        </Text>
      </Box>
    </Box>
  )
}

const format = (amount: number, decimals = 2) => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

const DebtClock = ({ usd, btc }) => {
  const [debt, setDebt] = React.useState(usd.initialAmount)
  const [debtBtc, setDebtBtc] = React.useState(btc.initialAmount)

  const btcRateToMatchDebt = Number(debt / BTC_SUPPLY)
  let btcRateToMatchDebtString = `$${format(btcRateToMatchDebt)}`

  const btcMarketCapPercentOfDebt = ((btc.price * BTC_SUPPLY) / debt) * 100
  const btcMarketCapPercentOfDebtString = `${format(btcMarketCapPercentOfDebt, 2)}%`

  const usDebtPerPerson = format(debt / US_POPULATION)
  const usDebtPerTaxPayer = format(debt / US_TAXPAYER_POPULATION)
  const debtToGDP = format((debt / usd.currentGDP) * 100)

  React.useEffect(() => {
    let amountUsd = usd.initialAmount
    let amountBtc = btc.initialAmount

    let interval = setInterval(() => {
      amountUsd += usd.changePerMs * 20
      amountBtc += btc.changePerMs * 20
      setDebt(amountUsd)
      setDebtBtc(amountBtc)
    }, 20)

    return () => clearInterval(interval)
  }, [usd.initialAmount, usd.changePerMs, btc.initialAmount, btc.changePerMs])

  return (
    <Flex direction="column" alignItems="flex-start" position="relative">
      <Box
        sx={{
          mt: 6,
          mx: [2],
          p: [4],
          maxWidth: [undefined, "460px"],
        }}
      >
        <TotalDebt amount={debt} pb={12} />

        <RowItem label="Debt To GDP" value={`${debtToGDP}%`} />
        {/* <RowItem label="GDP" value={`$${format(Number(usd.currentGDP.toFixed(0)))}`} /> */}
        <RowItem label="Debt Per Person" value={`$${usDebtPerPerson}`} />
        <RowItem label="Debt Per Taxpayer" value={`$${usDebtPerTaxPayer}`} />
        <RowItem
          label="Fully diluted Bitcoin marketcap as a percentage of total US debt"
          value={btcMarketCapPercentOfDebtString}
        />
        <RowItem
          label="Price of BTC for market cap to surpass total debt"
          value={btcRateToMatchDebtString}
        />
      </Box>
    </Flex>
  )
}

export default DebtClock

const RowItem = ({ label, value }) => {
  return (
    <Box pb={8}>
      <Text>{label}</Text>

      <Text
        sx={{
          fontWeight: 900,
          fontSize: 32,
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {value}
      </Text>
    </Box>
  )
}
