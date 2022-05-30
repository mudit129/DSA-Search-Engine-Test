import time
from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())

cnt = 1
urls = []
titles = []
while cnt < 46:
    driver.get("https://leetcode.com/problemset/all/?page=" + str(cnt))

    time.sleep(5)

    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    all_ques_div = soup.findAll("div", {"class":"overflow-hidden"})
    all_ques = []

    for ques in all_ques_div:
        all_ques.append(ques.findAll("div")[1].find("a"))


    for ques in all_ques:
        urls.append("https://leetcode.com/" + ques['href'])
        titles.append(ques.text)

# print(urls[10])
# print(titles[10])
# print(all_ques[5])
# i = 0
# for i in range(len(all_ques)):
#     titles[i] += "  -->  " + urls[i]

with open("Problems_urls_LC.txt", "w+") as f:
    f.write('\n'.join(urls))

with open("Titles_LC.txt", "w+") as f:
    f.write('\n'.join(titles))


# driver = webdriver.Chrome(ChromeDriverManager().install())

#driver.get("https://www.codechef.com/problems/XYSTR")

#urls = ["https://www.codechef.com/problems/XYSTR", "https://www.codechef.com/problems/SUBINC"]

# cnt = 1
# for url in urls:
#     if cnt == 45 or cnt == 46:
#         continue
#     driver.get(url)
#     time.sleep(5)

#     html = driver.page_source
#     soup = BeautifulSoup(html, 'html.parser')

#     problem_text = soup.find('div', {"class": "problem-statement"}).get_text()
#     problem_text = problem_text.encode("utf-8")
#     problem_text = str(problem_text)

#     with open("Problems/" + "problem"+str(cnt)+".txt", "w+") as f:
#         f.write(problem_text)

#     cnt+=1
