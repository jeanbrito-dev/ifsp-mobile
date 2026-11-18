import type { Tribute } from '../types/ifsp-content';

export function withLike(tribute: Tribute, liked: boolean): Tribute {
  if (tribute.likedByMe === liked) return tribute;
  return {
    ...tribute,
    likedByMe: liked,
    likesCount: Math.max(0, tribute.likesCount + (liked ? 1 : -1)),
  };
}

export function withReaction(tribute: Tribute, emoji: string, active: boolean): Tribute {
  const current = tribute.reactions.find((reaction) => reaction.emoji === emoji);
  if ((current?.reactedByMe ?? false) === active) return tribute;

  const reactions = current
    ? tribute.reactions.map((reaction) =>
        reaction.emoji === emoji
          ? {
              ...reaction,
              reactedByMe: active,
              count: Math.max(0, reaction.count + (active ? 1 : -1)),
            }
          : reaction,
      )
    : [...tribute.reactions, { emoji, count: 1, reactedByMe: true }];

  return { ...tribute, reactions };
}