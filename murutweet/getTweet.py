# koyamaru3のツイートからワンドロツイートを検索し、ツイート情報と画像情報を保存する
# cronで実行することを想定
# crontab -e
# 0 * * * * python3 /Library/WebServer/Documents/murutweet/getTweet.py

import sys
sys.path.append('/usr/local/lib/python3.9/site-packages')
import tweepy, config
import urllib.request, urllib.error

# 画像の保存先ディレクトリ
IMAGES_DIR = '/Library/WebServer/Documents/murutweet/images/'
TWEET_DIR = '/Library/WebServer/Documents/murutweet/'

# API Key
CK = config.CONSUMER_KEY
CS = config.CONSUMER_SECRET
AT = config.ACCESS_TOKEN
ATS = config.ACCESS_TOKEN_SECRET

auth = tweepy.OAuthHandler(CK, CS)
auth.set_access_token(AT, ATS)
api = tweepy.API(auth)

# 検索キーワード
#KEYWORDS = ['#ミルポン版深夜のお絵描き60分一本勝負']
KEYWORDS = ['#ミルモの里のお絵描き大会']
#KEYWORDS = ['#こやまるのミルモ絵']
#KEYWORDS = ['#ミルポン版深夜のお絵描き60分一本勝負','#こやまるのミルモ絵']

# 最新のツイートを取得する
try:
    for tweet in tweepy.Cursor(api.search,
                               q = KEYWORDS,
                               include_entities = True,
                               tweet_mode = 'extended',
                               lang = 'ja').items(100):

        if (tweet.user.screen_name == "koyamaru3"
            and not tweet.retweeted
            and 'RT @' not in tweet.full_text
            and 'media' in tweet.entities):

#            print (tweet)
            for media in tweet.entities['media']:
                murl = media['media_url_https']
                url = media['expanded_url']
        
            text = tweet.full_text
            twid = tweet.id
            break

except Exception as e:
    print ("[-] Error: ", e)
    
# デバッグ用
#print ("murl : ", murl)
#print ("text : ", text)
#print ("twid : ", twid)
#print ("url : ", url)

# 画像ファイルをダウンロードする
murl_orig = '%s:orig' % murl
image_filename = murl.split('/')[-1]
savepath = IMAGES_DIR + image_filename
try:
    response = urllib.request.urlopen(url=murl_orig)
    with open(savepath, "wb") as f:
        f.write(response.read())
except Exception as e:
    print ("[-] Error: ", e)

# 最新のツイート情報を保存する
filename = TWEET_DIR + "NEW.json"
new_json = '{"twid":"%s","url":"%s","image_filename":"%s"}' % (twid, url, image_filename)
try:
    file = open(filename, 'w')
    file.write(new_json)
except Exception as e:
    print ("[-] Error: ", e)
finally:
    file.close()

# 最新のツイート本文を保存する
filename = TWEET_DIR + "NEW.txt"
try:
    file = open(filename, 'w')
    file.write(text)
except Exception as e:
    print ("[-] Error: ", e)
finally:
    file.close()

