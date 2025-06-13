import React, { useState } from 'react'
import Card from '../common/Card'
import Input from '../common/Input'
import Button from '../common/Button'
import UserRegistrationInput from '../UserRegistrationInput'
import DetailedScores from '../DetailedScores'

const SearchScores = () => {
  return (
    <div>
      <UserRegistrationInput />
      <DetailedScores />
    </div>
  )
}

export default SearchScores