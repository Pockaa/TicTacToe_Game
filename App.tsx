import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { DifficultyScreen } from './src/screens/DifficultyScreen';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { MultiplayerGameScreen } from './src/screens/MultiplayerGameScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { useMultiplayerGame } from './src/hooks/useMultiplayerGame';
import { GameHistoryProvider, useGameHistory } from './src/context/GameHistoryContext';
import { AiDifficulty } from './src/types';

type Screen = 'menu' | 'local' | 'difficulty' | 'ai' | 'lobby' | 'multiplayer' | 'history';

function AppContent(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [aiDifficulty, setAiDifficulty] = useState<AiDifficulty>('hard');
  const { addLog } = useGameHistory();

  const handleMultiplayerGameEnd = useCallback((winner: any, isDraw: boolean, moves: any) => {
    addLog('online', winner, isDraw, moves);
  }, [addLog]);

  const multiplayer = useMultiplayerGame(handleMultiplayerGameEnd);

  // Navigate to multiplayer game when status becomes waiting or playing
  useEffect(() => {
    if (currentScreen === 'lobby' && (multiplayer.state.status === 'waiting' || multiplayer.state.status === 'playing')) {
      setCurrentScreen('multiplayer');
    }
  }, [multiplayer.state.status, currentScreen]);

  const handleCreateRoom = async () => {
    await multiplayer.createRoom();
  };

  const handleJoinRoom = async (code: string) => {
    await multiplayer.joinRoom(code);
  };

  const handleLeaveRoom = () => {
    multiplayer.leaveRoom();
    setCurrentScreen('menu');
  };

  return (
    <>
      <StatusBar style="light" />
      {currentScreen === 'menu' && (
        <MenuScreen
          onPlayLocal={() => setCurrentScreen('local')}
          onPlayOnline={() => setCurrentScreen('lobby')}
          onPlayAI={() => setCurrentScreen('difficulty')}
          onHistory={() => setCurrentScreen('history')}
        />
      )}
      {currentScreen === 'local' && (
        <GameScreen onBack={() => setCurrentScreen('menu')} mode="local" />
      )}
      {currentScreen === 'difficulty' && (
        <DifficultyScreen
          onSelect={(diff) => {
            setAiDifficulty(diff);
            setCurrentScreen('ai');
          }}
          onBack={() => setCurrentScreen('menu')}
        />
      )}
      {currentScreen === 'ai' && (
        <GameScreen onBack={() => setCurrentScreen('difficulty')} mode="ai" aiDifficulty={aiDifficulty} />
      )}
      {currentScreen === 'lobby' && (
        <LobbyScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onBack={() => setCurrentScreen('menu')}
          status={multiplayer.state.status}
          errorMessage={multiplayer.state.errorMessage}
        />
      )}
      {currentScreen === 'multiplayer' && (
        <MultiplayerGameScreen
          state={multiplayer.state}
          onPress={multiplayer.handlePress}
          onReset={multiplayer.resetGame}
          onLeave={handleLeaveRoom}
        />
      )}
      {currentScreen === 'history' && (
        <HistoryScreen onBack={() => setCurrentScreen('menu')} />
      )}
    </>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <GameHistoryProvider>
        <AppContent />
      </GameHistoryProvider>
    </SafeAreaProvider>
  );
}
