import nltk
# nltk.download('wordnet')
# nltk.download('omw-1.4')
from nltk.stem import WordNetLemmatizer


lemmatizer = WordNetLemmatizer()

print(lemmatizer.lemmatize('cats'))
print(lemmatizer.lemmatize('cacti'))
print(lemmatizer.lemmatize('geese'))
print(lemmatizer.lemmatize('rocks'))
print(lemmatizer.lemmatize('python'))