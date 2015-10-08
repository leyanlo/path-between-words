  function isWord(word) {
    return !!dictionary[word];
  }

  var alphabet = [];
  for (var i = 0, char = 'a'; i < 26; i++) {
    alphabet.push(char);
    char = String.fromCharCode(char.charCodeAt(0) + 1);
  }

  function getNeighbors(word) {
    var neighbors = [];
    var wordIndex, alphaIndex, insertIndex;
    for (wordIndex = 0; wordIndex < word.length; wordIndex++) {
      for (alphaIndex = 0; alphaIndex < alphabet.length; alphaIndex++) {
        var testWord;
        // First try inserting before word
        testWord = alphabet[alphaIndex] + word;
        if (isWord(testWord)) {
          neighbors.push(testWord);
        }

        // Then try either replacing or inserting after each letter
        for (insertIndex = 0; insertIndex < 2; insertIndex++) {
          if (word[wordIndex].toLowerCase() === alphabet[alphaIndex].toLowerCase()) {
            if (insertIndex === 0) {
              // Skip
              continue;
            } else {
              // Try removing letters for these cases
              testWord = word.substr(0, wordIndex) + word.substr(wordIndex + 1);
            }
          } else {
            testWord = word.substr(0, wordIndex + insertIndex) + alphabet[alphaIndex] + word.substr(wordIndex + 1);
          }

          if (isWord(testWord)) {
            neighbors.push(testWord);
          }
        }
      }
    }
    return neighbors;
  }

  function getHeuristic(start, goal) {
    var smaller, bigger;
    if (start.length < goal.length) {
      smaller = start;
      bigger = goal;
    } else {
      smaller = goal;
      bigger = start;
    }

    var heuristics = [];
    var difference = bigger.length - smaller.length;
    for (var i=0; i<difference+1; i++) {
      var j;
      var heuristic = difference;
      var alphaCounts = {}; // Count how many of each letter are different
      for (j=0; j<26; j++) {
        alphaCounts[alphabet[j]] = 0;
      }
      for (j=0; j<smaller.length; j++) {
        alphaCounts[smaller[j]]++;
        alphaCounts[bigger[i+j]]--;
      }
      for (j=0; j<26; j++) {
        heuristic += Math.abs(alphaCounts[alphabet[j]]);
      }
      heuristics.push(heuristic);
    }
    return Math.min.apply(null, heuristics);
  }

  function getPath(start, goal) {
    var closedSet = {};
    var openSet = [start];
    var cameFrom = {};

    var gScore = {};
    gScore[start] = 0;
    var fScore = {};
    fScore[start] = gScore[start] + getHeuristic(start, goal);

    var i;
    while (openSet.length > 0) {
      // current := the node in openset having the lowest f_score[] value
      var current = openSet[0];
      var currentIndex = 0;
      for (i=1; i<openSet.length; i++) {
        if (fScore[openSet[i]] && fScore[openSet[i]] < fScore[current]) {
          current = openSet[i];
          currentIndex = 0;
        }
      }
      openSet.splice(currentIndex, 1);
      if (current === goal) {
        return reconstructPath(cameFrom, goal);
      }
      closedSet[current] = true;
      var neighbors = getNeighbors(current);
      for (i=0; i<neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (closedSet[neighbor]) {
          continue;
        }

        var tentativeGScore = gScore[current] + 1;
        if (!gScore[neighbor] || tentativeGScore < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeGScore;
          fScore[neighbor] = gScore[neighbor] + getHeuristic(neighbor, goal);
          if (openSet.indexOf(neighbor) === -1) {
            openSet.unshift(neighbor);
          }
        }
      }
    }
    return [];
  }

  function reconstructPath(cameFrom, current) {
    var totalPath = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      totalPath.unshift(current);
    }
    return totalPath;
  }
