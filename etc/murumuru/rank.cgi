#!/usr/bin/perl
##
##  rank -- ムルムル2008のスコアランキングの登録と参照を行う
##    mode=add   スコアを追加する
##    mode=read  現在のポイントを参照する
## 2008/09/21 初版作成

use Digest::MD5 qw/md5_hex/;
use Time::Local;

######## 定数宣言 #############################################################
$MAX_RANK = 20;
$ADD_KEY = "masyumaro";				# 平文に付与するキー
$FILE_NAME = "rank.csv";			# 記録ファイル名
$FILE_A_NAME = "rank_arcade.csv";	# 記録ファイル名(アーケードモード)
$LOCK_FILE = "rank.loc";			# ロックファイル名

######## (1)リクエスト情報解析 ################################################
&initForm();
$mode = $FORM{'mode'};
$level = $FORM{'level'};
$new_name = $FORM{'name'};
$new_score = $FORM{'score'};
$key = $FORM{'key'};

if ($level eq "0") {
	$filename = $FILE_NAME;
} else {
	$filename = $FILE_A_NAME;
}

######## (3)ロック ############################################################
&setLock("$LOCK_FILE");

######## (4)CSVファイル読み込み ###############################################
open(R, "$filename") || &sendError(-1);
@lines = <R>;
close(R);

######## (5)ネームエントリの場合 ##############################################
if ($mode eq "entry") {
	# 認証(MD5)
	$hirabun = $new_score.$ADD_KEY;
	$md5 = md5_hex($hirabun);
	if ($md5 ne $key) {&sendError(-4);}
	
	# ランクイン可能かチェックする
	$cnt = 0;
	$isAdd = 0;
	foreach (0 .. $#lines) {
		$this_line = $lines[$_];
		($score, $name) = split(/,/, $this_line);
		if ($score < $new_score && $isAdd == 0) {
			$new_line = $new_score.",".$new_name.",\n";
			push(@new, $new_line);
			$isAdd=1;
			$cnt++;
			if ($cnt >=$MAX_RANK) {last;}
		}
		push(@new, $this_line);
		$cnt++;
		if ($cnt >=$MAX_RANK) {last;}
	}
	if ($cnt < $MAX_RANK && $isAdd == 0) {
		$new_line = $new_score.",".$new_name.",\n";
		push(@new, $new_line);
		$isAdd=1;
	}
	
	# ファイルの先頭に追記する
	open(W,">$filename") || &sendError(-2);
	print W @new;
	close(W);
	@lines = @new;
}


######## (6)ロック解除 ########################################################
if (-e $LOCK_FILE) {rmdir($LOCK_FILE);}

######## (7)HTTPレスポンス生成 ################################################
$responseName = "";
$responseScore = "";
foreach (0 .. $#lines) {
	($score, $name) = split(/,/, $lines[$_]);
	$responseName .= $name.",";
	$responseScore .= $score.",";
}
$num = $#lines+1;
print "Content-type: text/plain\n\n";
print "result=0&responseNum=$num&responseScore=$responseScore&responseName=$responseName";
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
