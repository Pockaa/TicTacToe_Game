import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MenuScreen } from './src/screens/MenuScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LobbyScreen } from './src/screens/LobbyScreen';
import { MultiplayerGameScreen } from './src/screens/MultiplayerGameScreen';
import { useMultiplayerGame } from './src/hooks/useMultiplayerGame';

type Screen = 'menu' | 'local' | 'lobby' | 'multiplayer';

export default function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const multiplayer = useMultiplayerGame();

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
    <SafeAreaProvider>
      <StatusBar style="light" />
      {currentScreen === 'menu' && (
        <MenuScreen
          onSinglePlayer={() => setCurrentScreen('local')}
          onMultiplayer={() => setCurrentScreen('lobby')}
        />
      )}
      {currentScreen === 'local' && (
        <GameScreen onBack={() => setCurrentScreen('menu')} />
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
    </SafeAreaProvider>
  );
}
