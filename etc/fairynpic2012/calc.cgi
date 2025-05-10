#!/usr/bin/perl
##
##  calc -- フェアリンピック出場10妖精のポイントを集計する
##    mode=calc  ポイントを追加する
##    mode=read  現在のポイントを参照する
## 2008/07/22 初版作成

use Digest::MD5 qw/md5_hex/;
use Time::Local;

# 応答電文
# 0  戦闘前の敵番号
# 1  戦闘前の敵の残りHP
# 2  戦闘前の妖精1番号
# 3  戦闘前の妖精1の得点
# 4  戦闘後の妖精1の得点
# 5  戦闘前の妖精2番号
# 6  戦闘前の妖精2の得点
# 7  戦闘後の妖精2の得点
# 8  戦闘前の妖精3番号
# 9  戦闘前の妖精3の得点
# 10 戦闘後の妖精3の得点
# 11 妖精1番号
# 12 妖精1の攻撃
# 13 妖精2番号
# 14 妖精2の攻撃
# 15 妖精3番号
# 16 妖精3の攻撃
# 17 敵の攻撃対象の妖精番号
# 18 敵の攻撃
# 19 敵の攻撃対象の妖精番号
# 20 敵の攻撃
# 21 妖精1番号
# 22 妖精1の攻撃
# 23 妖精2番号
# 24 妖精2の攻撃
# 25 妖精3番号
# 26 妖精3の攻撃
# 27 敵の攻撃対象の妖精番号
# 28 敵の攻撃
# 29 敵の攻撃対象の妖精番号
# 30 敵の攻撃

######## 定数宣言 #############################################################
$MAX_FAIRY = 10;					# 妖精の数
$ADD_KEY = "masyumaro";				# 平文に付与するキー
$FILE_NAME = "calc.csv";			# 妖精スコアのファイル名
$LOCK_FILE = "calc.loc";			# ロックファイル名
$FILE_NAME2 = "enemy.csv";			# 敵情報ファイル名

$HOST_FILE = "host.dat";

$ATK = 100;							# 妖精の攻撃力
$HOSEI = 0.5;						# 攻撃力の範囲(-50%～+50%)
$BONUS = 500;						# 倒した時のボーナスポイント(初期値)
$BONUS2 = 20;						# 敵番号*BONUS_RATEを加算
$ENEMY_HP = 3000;					# 初期の敵HP
$ENEMY_RATE = 0.7;					# 敵の攻撃力(妖精の攻撃力に対する割合)

$START_DAY  = timelocal( 0,  0,  0, 28, 7 -1, 2012); # 第一段階開始日(7/28～)
$SECOND_DAY = timelocal( 0,  0,  0,  5, 8 -1, 2012); # 第二段階開始日(8/5～)
#$START_DAY  = timelocal( 0,  0,  0, 12, 7 -1, 2012); # 第一段階開始日(7/27～)
#$SECOND_DAY = timelocal( 0,  0,  0, 20, 7 -1, 2012); # 第二段階開始日(8/7～)
$THIRD_DAY  = timelocal( 0,  0,  0, 8, 8 -1, 2012); # 第三段階開始日(8/8～)
$END_DAY    = timelocal(59, 59, 23, 9, 8 -1, 2012); # 投票終了日(～8/9 23:59:59)
$nowDay = time;

######## (1)リクエスト情報解析 ################################################
&initForm();
$mode = $FORM{'mode'};
$point = $FORM{'point'};
$mes = $FORM{'mes'};
$key = $FORM{'key'};
$fairy1 = $FORM{'fairy1'};
$fairy2 = $FORM{'fairy2'};
$fairy3 = $FORM{'fairy3'};

$ENV{'TZ'} = "JST-9";
$time = time;

$ip  = $ENV{'REMOTE_ADDR'};
$ip2 = $ip;
$ip2 =~ s/(\d+\.\d+\.\d+)\.\w+/$1/;
$agent = $ENV{'HTTP_USER_AGENT'}; 

######## (2)日付チェックの場合 ################################################
if ($mode eq "check") {

	print "Content-type: text/plain\n\n";
	
	if ($nowDay < $START_DAY) {print "date=before&result=0";exit();}
	elsif ($nowDay >= $END_DAY) {print "date=after&result=0";exit();}
	
	# ホストファイルのチェック
	# 第3引数=期間,第4引数=単位(0:分,1:時間,2:日)
	$result = &check_host($ip, $agent, 1, 1);
#	$result = &check_host($ip, $agent, 1, 0);
	
	if ($result == -1) {print "date=error&result=0";exit();}
	elsif ($result == 1) {print "date=notplay&result=0";exit();}

	if ($nowDay >= $START_DAY && $nowDay < $SECOND_DAY)  {print "date=1&result=0";}
	elsif ($nowDay >= $SECOND_DAY && $nowDay < $THIRD_DAY) {print "date=2&result=0";}
	elsif ($nowDay >= $THIRD_DAY && $nowDay < $END_DAY) {print "date=3&result=0";}
	exit();
}

######## (2-1)データ取得の場合 ################################################
if ($mode eq "get") {
	open(R, "$FILE_NAME") || &sendError(-1);
	@data_str = <R>;
	close(R);
	print "Content-type: text/plain\n\n";
	push @score, split(/\,/, $data_str[0]);
	$line = "act=";
	for ($i=0; $i<$MAX_FAIRY; $i++) {
		$line .= "$score[$i]_";
	}
	$line .= "&result=0";
	print $line;
	exit();
}

# 期間によってダメージ倍率を変更する(デフォルト1.0倍)
$dmg_bai = 1;
if ($nowDay >= $START_DAY && $nowDay < $SECOND_DAY) {$dmg_bai = 1;}
elsif ($nowDay >= $SECOND_DAY && $nowDay < $THIRD_DAY) {$dmg_bai = 2;}
elsif ($nowDay >= $THIRD_DAY && $nowDay < $END_DAY) {$dmg_bai = 3;}

######## (3)ロック ############################################################
&setLock("$LOCK_FILE");

# ホストファイルを最新化
$result = &renew_host($ip, $agent, 1, 1);
#$result = &renew_host($ip, $agent, 1, 0);
if ($result != 0) {&sendError(-1);}

######## (4)CSVファイル読み込み ###############################################
open(R, "$FILE_NAME") || &sendError(-1);
@data_str = <R>;
close(R);
push @score, split(/\,/, $data_str[0]);
for ($i=0; $i<$MAX_FAIRY; $i++) {$score[$i] = $score[$i]+0;} # 数値に変換

open(R2, "$FILE_NAME2") || &sendError(-1);
@data_str2 = <R2>;
close(R2);
push @enemy, split(/\,/, $data_str2[0]);
$enemy[0] = $enemy[0]+0; # 数値に変換
$enemy[1] = $enemy[1]+0; # 数値に変換

$count = 0;

######## (5)ポイント追加の場合 ################################################
if ($mode eq "calc") {
	# 日付チェック
	$isWrite = 1;
	if ($nowDay < $START_DAY ||  $nowDay >= $END_DAY)  {$isWrite = 0;}
	
	# 認証(MD5)
#	$hirabun = $point.$ADD_KEY;
#	$md5 = md5_hex($hirabun);
#	if ($md5 ne $key) {&sendError(-4);}
	
	# 
	$fairy[0] = $fairy1+0; # 妖精番号
	$fairy[1] = $fairy2+0; # 妖精番号
	$fairy[2] = $fairy3+0; # 妖精番号
	
	# 初期のスコアを格納
	$act[$count++] = $enemy[0]+0;         # ★初期の敵番号を記入
	$act[$count++] = $enemy[1]+0;         # ★初期の敵HPを記入
	$act[$count++] = $fairy[0];           # ★妖精1番号を記入
	$act[$count++] = $score[$fairy[0]];   # ★初期の妖精1HPを記入
	$act[$count++] = 0;                   # ★戦闘後の妖精1HPを記入
	$act[$count++] = $fairy[1];           # ★妖精2番号を記入
	$act[$count++] = $score[$fairy[1]];   # ★初期の妖精2HPを記入
	$act[$count++] = 0;                   # ★戦闘後の妖精2HPを記入
	$act[$count++] = $fairy[2];           # ★妖精3番号を記入
	$act[$count++] = $score[$fairy[2]];   # ★初期の妖精3HPを記入
	$act[$count++] = 0;                   # ★戦闘後の妖精3HPを記入
	
	# 妖精の攻撃
	LOOPLABEL: for ($loop=0; $loop<2; $loop++) {
		for ($i=0; $i<3; $i++) {
			$attack = ($ATK + int(rand($ATK*($HOSEI*2))-$ATK*$HOSEI))*$dmg_bai;
			$score[$fairy[$i]] += $attack;
			$act[$count++] = $fairy[$i];  # ★攻撃者を記入
			$act[$count++] = $attack;     # ★ダメージを記入
			$enemy[1] -= $attack;
			
			# 敵のHPが0以下になった場合
			if ($enemy[1] <= 0) {
				$act[$count++] = -100;    # ★倒したことを示すフラグを記入
				$act[$count++] = $BONUS + $act[0]*$BONUS2;  # ★ボーナスポイントを記入
				$score[$fairy[$i]] += $BONUS + $act[0]*$BONUS2;
				
				# 次の敵を準備して終了する
				$enemy[0]++;
				$enemy[1]=$ENEMY_HP;
				last LOOPLABEL;
			}
		}
		# 敵の攻撃
		for ($i=0; $i<2; $i++) {
			$target = int(rand(3));
			$attack = $ATK + int(rand($ATK*($HOSEI*2))-$ATK*$HOSEI);
#			$attack = int(($attack*$ENEMY_RATE)*$dmg_bai);
			$attack = int(($attack*$ENEMY_RATE));
			$score[$fairy[$target]] -= $attack;
			$act[$count++] = $target;
			$act[$count++] = $attack;
		}
	}
	$act[4] = $score[$fairy[0]];
	$act[7] = $score[$fairy[1]];
	$act[10] = $score[$fairy[2]];
	
	$line = "";
	for ($i=0; $i<$MAX_FAIRY; $i++) {
		$line .= "$score[$i],";
	}
	$line2 = "$enemy[0],$enemy[1],";
	
	# ファイルの先頭に追記する
	if ($isWrite == 1) {
		open(W,">$FILE_NAME") || &sendError(-2);
		print W $line;
		close(W);
		open(W2,">$FILE_NAME2") || &sendError(-2);
		print W2 $line2;
		close(W2);
	}
}

######## (6)ロック解除 ########################################################
if (-e $LOCK_FILE) {rmdir($LOCK_FILE);}

######## (7)HTTPレスポンス生成 ################################################
print "Content-type: text/plain\n\n";
$line = "act=";
for ($i=0; $i<$count; $i++) {
	$line .= "$act[$i]_";
}
$line .= "&result=0";
print $line;
exit();

######## 関数群 ###############################################################
sub sendError {
	local($error_code) = @_;
	print "Content-type: text/plain\n\n";
	print "result=$error_code";
	exit();
}

sub setLock {
	$lflag = 0;
	foreach (1 .. 5) {if(mkdir($_[0], 0755)){$lflag=1; last;}else{sleep(1);}}
	if ($lflag == 0) {
		if(-e $_[0]){rmdir($_[0]);}
		sendError(-3);
	}
}
sub initForm {
	local($query, @assocarray, $assoc, $property, $value, $charcode, $method, $cnt);
	$method = $ENV{'REQUEST_METHOD'};
	$method =~ tr/A-Z/a-z/;
	if ($method eq 'post') {
		read(STDIN, $query, $ENV{'CONTENT_LENGTH'});
	} else {
		$query = $ENV{'QUERY_STRING'};
	}
	@assocarray = split(/&/, $query);
	$cnt = 0;
	foreach $assoc (@assocarray) {
		($property, $value) = split(/=/, $assoc);
		$value =~ tr/+/ /;
		$value =~ s/%([A-Fa-f0-9][A-Fa-f0-9])/pack("C", hex($1))/eg;
		if ($property eq "id") {
			$formid[$cnt++] = $value;
		}
		$FORM{$property} = $value;
	}
}

### 2012/05/15 koyamaru add start ###
# ホストファイルによる連続投票チェック
sub check_host {
my ($ip, $agent, $kval, $kunit) = @_;
my $hlog = $HOST_FILE;
my ($tani, $kakeru);

if (!$kunit) {
	$tani = "分"; $kakeru = 60;
} elsif ($kunit == 1) {
	$tani = "時間"; $kakeru = 3600;
} elsif ($kunit == 2) {
	$tani = "日"; $kakeru = 86800;
}

	# ホストファイルを読み込む
	if (!open (HOST, "<$hlog")) { return -1; }
	
	my @OLDHOST = <HOST>;
	close (HOST);

	while (chomp ($_ = shift (@OLDHOST))) {
		my ($ihost, $iagent, $itime) = split(/<>/);
		if (($ip eq $ihost && $agent eq $iagent) &&
			$itime + ($kval * $kakeru) >= $time) {
			# ホストの照合(存在時はエラー)
			return 1;
		}
	}
	return 0;
}

sub renew_host {
my ($ip, $agent, $kval, $kunit) = @_;
my $hlog = $HOST_FILE;
my ($tani, $kakeru);

if (!$kunit) {
	$tani = "分"; $kakeru = 60;
} elsif ($kunit == 1) {
	$tani = "時間"; $kakeru = 3600;
} elsif ($kunit == 2) {
	$tani = "日"; $kakeru = 86800;
}

	# ホストファイルを読み込む
	if (!open (HOST, "<$hlog")) { return -1; }
	
	my @OLDHOST = <HOST>;
	close (HOST);

	# 閲覧禁止時間が過ぎていないホストのみにする
	my @NEWHOST = ();
	while (chomp ($_ = shift (@OLDHOST))) {
		my ($ihost, $iagent, $itime) = split(/<>/);
		if ($itime + ($kval * $kakeru) < $time) {
			# リストから削除する(移し替えない)
		} else {
			# リストから削除しない(移し替える)
			push (@NEWHOST, "$ihost<>$iagent<>$itime\n");
			
			# ホストの照合(存在時はエラー)
			if ($ip eq $ihost && $agent eq $iagent) {
				return -1;
			}
		}
	}

	# ホストと時刻を追加する
	push (@NEWHOST, "$ip<>$agent<>$time\n");

	# ホストファイルに保存する
	if (!open (HOST, "+<$hlog")) { return -1; }
	seek (HOST, 0, 0);
	print HOST @NEWHOST;
	truncate(HOST, tell);
	close(HOST);
	return 0;
}
