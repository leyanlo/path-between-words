with open('dictionary.js', 'w') as fout:
    fout.write('var dictionary = {')
    with open('words.txt', 'rU') as fin:
        first = True
        for line in fin:
            if not line[0].isupper():
                if first:
                    first = False
                else:
                    fout.write(',')
                fout.write(line.rstrip())
                fout.write(':1')
    fout.write('};')
