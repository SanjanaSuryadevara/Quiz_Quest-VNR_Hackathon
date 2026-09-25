# 🎮 Quiz Quest — Gamified Learning

> An interactive gamified learning platform designed to make learning more engaging, rewarding, and enjoyable for children.

## 📌 Overview

Quiz Quest is a gamified educational quiz application that combines learning with game mechanics such as:

- ⭐ Stars
- 🪙 Coins
- 🔥 Streaks
- 🏆 Achievement badges
- 🧑‍🚀 Custom avatars
- 🎁 Reward shop
- 🔊 Interactive sound effects
- 📊 Subject-wise progress

The project was developed around the idea of transforming traditional learning into an interactive experience where children can learn through quizzes, visual questions, rewards, and repeated practice.

The original project concept focused on using gamification to improve children's engagement with learning by introducing game elements into educational activities.

## 🎯 Problem Statement

Children can lose interest when learning involves repeatedly studying the same material for long periods.

The goal of this project is to make learning more interactive by combining educational content with game mechanics, encouraging children to participate, practice, and continue learning.

## 💡 Solution

Quiz Quest provides different learning categories where children answer questions and receive rewards for correct answers.

The application supports:

- Educational quizzes
- Visual learning
- Multiple-choice questions
- Multiple attempts
- Immediate feedback
- Rewards for successful answers
- Progress tracking
- Personalized avatars
- Achievement badges

The gamification concept is based on the original project proposal, which describes categories such as fruits, vegetables, animals, numbers, and curriculum-based subjects. 

## ✨ Features

### 📚 Multiple Learning Worlds

The application currently includes:

| World | Description |
|---|---|
| 🚀 Math Blast | Addition, subtraction, multiplication, division, even/odd and half-number questions |
| 🦁 Animal Kingdom | Animal identification and basic animal facts |
| 🪐 Space Explorers | Planets, stars, astronauts and space-related questions |
| 📖 Word Wizards | Synonyms and antonyms |
| 🍓 Fruity Fun | Fruit identification |
| 🥕 Veggie Patch | Vegetable identification |
| 🔤 ABC Adventure | Letters and beginning sounds |
| 🔢 Number Ninjas | Counting questions |
| 🌈 Colors & Shapes | Color and shape identification |
| 🔍 Identify It! | Everyday object identification |

## 🧠 Dynamic Question Generation

Each quiz generates a fresh set of **8 questions**.

Questions are randomly sampled and answer choices are shuffled, making different quiz rounds vary from one another.

Math and counting questions are procedurally generated, while other subjects use structured question pools.

## 🎮 Gamification Mechanics

### ⭐ Stars

Correct answers contribute to the player's score and subject progress.

### 🪙 Coins

Players earn coins for successfully answering questions.

Coins can also increase based on the player's current streak.

### 🔥 Streaks

Consecutive correct answers increase the player's streak.

The application tracks the best streak achieved during a quiz session.

### 🏆 Badges

Players receive achievement badges based on quiz performance:

- 🥇 Gold Champion
- 🥈 Silver Star
- 🥉 Bronze Buddy
- 🌱 Keep Practicing

### 🧑‍🚀 Avatars

Players start with multiple available avatars and can unlock additional avatars using earned coins.

### 🎁 Reward Shop

Coins can be spent in the reward shop to unlock additional character avatars.

## 🎲 Quiz Rules

Each question provides multiple answer choices.

Players can make up to **3 attempts** on a question.

- Correct answer → rewards are earned
- Incorrect answer → another attempt is available
- After the maximum attempts are exhausted → the answer is revealed and the player proceeds

This follows the original gamified-learning concept of allowing additional chances after an incorrect answer.

## 🔊 Interactive Experience

The application includes sound effects for:

- Correct answers
- Incorrect answers
- Button interactions
- Coin rewards

Users can also toggle sound on or off.

## 📊 Progress Tracking

The home screen displays:

- Total stars earned
- Coin balance
- Best score for each subject
- Available avatars
- Subject-wise progress

Each subject displays up to 8 stars representing the player's best performance.

## 🛠️ Technology Stack

- **React.js**
- **JavaScript**
- **Lucide React**
- **HTML/CSS**
- **Web Audio API**

## 🏗️ Application Structure

```text
Quiz Quest
│
├── Home
│   ├── Avatar Selection
│   ├── Subject Selection
│   ├── Progress
│   └── Coin Balance
│
├── Quiz
│   ├── Questions
│   ├── Multiple Choices
│   ├── Attempts
│   ├── Streaks
│   └── Rewards
│
├── Results
│   ├── Badge
│   ├── Stars
│   ├── Coins
│   └── Best Streak
│
└── Reward Shop
    └── Avatar Unlocks
