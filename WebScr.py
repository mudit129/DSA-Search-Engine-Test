import time
from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())

driver.get("https://www.codechef.com/tags/problems/dynamic-programming")

time.sleep(5)

html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

all_ques_div = soup.findAll("div", {"class":"problem-tagbox-inner"})
all_ques = []

for ques in all_ques_div:
    all_ques.append(ques.findAll("div")[0].find("a"))

urls = []
titles = []

cnt = 1
for ques in all_ques:
    if cnt == 43:
        break
    urls.append("https://www.codechef.com" + ques['href'])
    titles.append(ques.text)
    cnt+=1

# print(urls[10])
# print(titles[10])
# print(all_ques[5])
# i = 0
# for i in range(len(all_ques)):
#     titles[i] += "  -->  " + urls[i]

with open("Problems_urls_old.txt", "w+") as f:
    f.write('\n'.join(urls))

with open("Titles_old.txt", "w+") as f:
    f.write('\n'.join(titles))


# driver = webdriver.Chrome(ChromeDriverManager().install())

#driver.get("https://www.codechef.com/problems/XYSTR")

#urls = ["https://www.codechef.com/problems/XYSTR", "https://www.codechef.com/problems/SUBINC"]

cnt = 1
for url in urls:
    driver.get(url)
    time.sleep(5)

    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    problem_text = soup.find('div', {"class": "problem-statement"}).get_text()
    problem_text = problem_text.encode("utf-8")
    problem_text = str(problem_text)

    with open("Problems_old/" + "problem"+str(cnt)+".txt", "w+") as f:
        f.write(problem_text)

    cnt+=1
