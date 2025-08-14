"use client";

import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Puzzle, Play, Clock, Gift, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PuzzleProgress {
  currentPieces: number;
  piecesNeeded: number;
  canClaimPack: boolean;
  dailyPiecesEarned: number;
  dailyPiecesLimit: number;
  totalPacksClaimed: number;
}

interface AdWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  placement: string;
  rewardText: string;
}

interface PuzzleSystemProps {
  userId: string;
  className?: string;
}

const AdWatchModal: FC<AdWatchModalProps> = ({ isOpen, onClose, onComplete, placement, rewardText }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isWatching && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isWatching && countdown === 0) {
      setIsWatching(false);
      onComplete();
    }
  }, [isWatching, countdown, onComplete]);

  const handleWatchAd = () => {
    setIsWatching(true);
    setCountdown(15); // 15 second mock ad
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 text-center">
        {!isWatching ? (
          <>
            <div className="mb-4">
              <Play className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold">Watch an Ad</h3>
              <p className="text-sm text-muted-foreground">{rewardText}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleWatchAd} className="flex-1">
                Watch an Ad
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="text-2xl font-bold text-primary">{countdown}</div>
              </div>
              <h3 className="text-lg font-semibold">Advertisement Playing</h3>
              <p className="text-sm text-muted-foreground">Please wait {countdown} seconds</p>
            </div>
            <Progress value={((15 - countdown) / 15) * 100} className="w-full" />
          </>
        )}
      </Card>
    </div>
  );
};

const PuzzleSystem: FC<PuzzleSystemProps> = ({ userId, className }) => {
  const [progress, setProgress] = useState<PuzzleProgress>({
    currentPieces: 0,
    piecesNeeded: 20,
    canClaimPack: false,
    dailyPiecesEarned: 0,
    dailyPiecesLimit: 10,
    totalPacksClaimed: 0,
  });
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Load puzzle progress from localStorage (in real app, this would be from API)
  useEffect(() => {
    const savedProgress = localStorage.getItem(`puzzle_progress_${userId}`);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [userId]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => setCooldownRemaining(cooldownRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  const handleWatchAdForPiece = () => {
    if (progress.dailyPiecesEarned >= progress.dailyPiecesLimit) {
      return; // Daily limit reached
    }
    setIsAdModalOpen(true);
  };

  const handleAdComplete = () => {
    setIsAdModalOpen(false);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newProgress = {
        ...progress,
        currentPieces: progress.currentPieces + 1,
        dailyPiecesEarned: progress.dailyPiecesEarned + 1,
        canClaimPack: progress.currentPieces + 1 >= progress.piecesNeeded,
      };
      
      setProgress(newProgress);
      localStorage.setItem(`puzzle_progress_${userId}`, JSON.stringify(newProgress));
      setIsLoading(false);
      setCooldownRemaining(300); // 5 minute cooldown
    }, 1000);
  };

  const handleClaimPack = () => {
    if (!progress.canClaimPack) return;

    setIsLoading(true);
    // Simulate pack claim
    setTimeout(() => {
      const newProgress = {
        ...progress,
        currentPieces: progress.currentPieces - progress.piecesNeeded,
        canClaimPack: false,
        totalPacksClaimed: progress.totalPacksClaimed + 1,
      };
      
      setProgress(newProgress);
      localStorage.setItem(`puzzle_progress_${userId}`, JSON.stringify(newProgress));
      setIsLoading(false);

      // Show success message or trigger pack opening animation
      // This would integrate with the existing pack opening modal
    }, 1000);
  };

  const progressPercentage = (progress.currentPieces / progress.piecesNeeded) * 100;
  const canWatchAd = progress.dailyPiecesEarned < progress.dailyPiecesLimit && cooldownRemaining === 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card className={cn("p-6", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400">
            <Puzzle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Puzzle Pack Challenge</h3>
            <p className="text-sm text-muted-foreground">
              Collect {progress.piecesNeeded} pieces to unlock a special pack!
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          {/* Main Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {progress.currentPieces} / {progress.piecesNeeded} pieces
              </span>
              <Badge variant={progress.canClaimPack ? "default" : "secondary"}>
                {progress.canClaimPack ? "Ready!" : `${progress.piecesNeeded - progress.currentPieces} needed`}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Visual Puzzle Pieces */}
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: progress.piecesNeeded }, (_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "aspect-square rounded-sm border-2 transition-all duration-300",
                  index < progress.currentPieces
                    ? "bg-gradient-to-br from-purple-400 to-pink-400 border-purple-300 shadow-sm"
                    : "bg-muted border-muted-foreground/20"
                )}
              />
            ))}
          </div>

          {/* Daily Progress */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Daily pieces: {progress.dailyPiecesEarned} / {progress.dailyPiecesLimit}</span>
            <span>Packs claimed: {progress.totalPacksClaimed}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleWatchAdForPiece}
              disabled={!canWatchAd || isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Watching...</span>
                </div>
              ) : cooldownRemaining > 0 ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(cooldownRemaining)}</span>
                </div>
              ) : progress.dailyPiecesEarned >= progress.dailyPiecesLimit ? (
                <span>Daily Limit Reached</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>Watch an Ad for Piece</span>
                </div>
              )}
            </Button>

            <Button
              onClick={handleClaimPack}
              disabled={!progress.canClaimPack || isLoading}
              className="flex-1"
            >
              {progress.canClaimPack ? (
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  <span>Claim Pack!</span>
                </div>
              ) : (
                <span>Need More Pieces</span>
              )}
            </Button>
          </div>

          {/* Bonus Message */}
          <AnimatePresence>
            {progress.canClaimPack && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              >
                <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Puzzle Complete! Claim your reward pack!</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <AdWatchModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onComplete={handleAdComplete}
        placement="puzzle_piece_ad"
        rewardText="Watch this ad to earn a puzzle piece!"
      />
    </>
  );
};

export default PuzzleSystem;
