import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

export function next(state) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')));
  // set winner state if entries size is down to one
  if (entries.size === 1) {
    return state.remove('vote').remove('entries').set('winner', entries.first());
  }

  return state.merge({
    vote: Map({pair: entries.take(2)}),
    entries: entries.skip(2)
  });
}

// updatedIn adds Maps to anything in the path that is missing
// path to find data and use function
// if no data is found at data path - init with a 0 there.
// apply this function to the path of 'vote', 'tally', '[entry name]'
export function vote(voteState, entry) {
  return voteState.updateIn(
    ['tally', entry],
    0,
    tally => tally + 1
  );
}


function getWinners(vote) {
  if (!vote) {
    return [];
  }
  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);

  if(aVotes > bVotes) {
    return [a];
  } else if(aVotes < bVotes) {
    return [b];
  } else {
    return [a, b];
  }
}