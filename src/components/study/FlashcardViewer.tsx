import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/types";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
}

export function FlashcardViewer({ flashcards }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(flashcards);
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const knownPercentage = (knownCards.size / cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
  };

  const handleMarkKnown = (known: boolean) => {
    const newKnownCards = new Set(knownCards);
    if (known) {
      newKnownCards.add(currentIndex);
    } else {
      newKnownCards.delete(currentIndex);
    }
    setKnownCards(newKnownCards);

    // Auto-advance to next card
    if (currentIndex < cards.length - 1) {
      handleNext();
    }
  };

  const isCardKnown = knownCards.has(currentIndex);

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="font-medium">
            {knownCards.size} / {cards.length} known (
            {Math.round(knownPercentage)}%)
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Flashcard */}
      <Card
        className={cn(
          "min-h-[400px] cursor-pointer transition-all duration-300",
          "hover:shadow-lg",
          isFlipped && "bg-muted",
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <CardContent className="flex items-center justify-center p-12 h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground uppercase tracking-wide">
              {isFlipped ? "Answer" : "Question"}
            </div>
            <p className="text-2xl font-medium leading-relaxed">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
            <p className="text-sm text-muted-foreground">Click to flip</p>
          </div>
        </CardContent>
      </Card>

      {/* Know/Don't Know Buttons (show after flip) */}
      {isFlipped && (
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkKnown(false);
            }}
            className={cn(
              "h-16",
              !isCardKnown && "border-red-500 text-red-600",
            )}
          >
            <X className="mr-2 h-5 w-5" />
            Don't Know
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkKnown(true);
            }}
            className={cn(
              "h-16",
              isCardKnown && "border-green-500 text-green-600 bg-green-50",
            )}
          >
            <Check className="mr-2 h-5 w-5" />I Know This
          </Button>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShuffle}>
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Completion Message */}
      {currentIndex === cards.length - 1 && isFlipped && (
        <Card className="bg-primary/5 border-primary">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">🎉 Deck Complete!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You've reviewed all {cards.length} cards. You know{" "}
              {knownCards.size} ({Math.round(knownPercentage)}%).
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleReset} variant="outline">
                Start Over
              </Button>
              <Button onClick={handleShuffle}>Shuffle & Review Again</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
