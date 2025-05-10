#!/usr/bin/perl
##
##  getLuck -- 16妖精の運勢を決定し、指定された妖精の運勢を返却する
##
## 2007/01/17 初版作成

######## 定数宣言 #############################################################
$MAX_FAIRY = 16;					# 妖精の数
$MAX_LITEM = 73;					# ラッキーアイテムの最大数
$MAX_SITEM = 58;					# キャラソンの最大数
$FILE_NAME = "luck.csv";			# 運勢記録ファイル名
$LOCK_FILE = "luck.loc";			# ロックファイル名

######## (1)リクエスト情報解析 ################################################
&initForm();
$number = $FORM{'number'};
if (defined $number) {
} else {
	&sendError(-4);
}

######## (2)ロック ############################################################
&setLock("$LOCK_FILE");

######## (3)CSVファイル読み込み ###############################################
open(R, "$FILE_NAME") || &sendError(-1);
@data_str = <R>;
close(R);

######## (4)配列に格納 ########################################################
$length = @data_str;
$day_num = $length>=10 ? 10 : $length;
for ($cnt=0; $cnt<10; $cnt++) {
	if ($cnt == $length) {last;}
	push @data, [ split(/,/, $data_str[$cnt]) ];
}

######## (5)今日の日付収集 ####################################################
($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst)
	 = localtime(time());
$year += 1900;
$mon += 1;

# 本日初アクセスかチェック
$isFirst = 0;
if ($day_num == 0) {$isFirst = 1;}
else {
	# 前日と日付が異なるかチェック
	$cmp_date = $data[0][0];
	($pYear, $pMon, $pMday) = split(/\//,$cmp_date);
	if ($year ne $pYear || $mon ne $pMon || $mday ne $pMday) {$isFirst = 1;}
}
######## (6-1)初アクセス時の占いデータ生成 ####################################
if ($isFirst == 1) {
	# 妖精の数分算出する
	for ($fn = 0; $fn < $MAX_FAIRY; $fn++) {
		
		# ラブボルテージを算出する (10以上が算出できるまで繰り返し)
		$LOW_LV = 10;
		do {
			if (($lv[$fn] = int(rand 110)) >= 100) {$lv[$fn] = 100;}
		} while ($lv[$fn] < $LOW_LV);
		
		# 使用中ラッキーアイテム配列を作成する
		# （配列初期化 / 過去10日分の設定/ 他妖精の本日算出分の設定)
		for ($cnt=0; $cnt < $MAX_LITEM; $cnt++) {$use_litem[$cnt] = 0;}
		for ($cnt=0; $cnt < $day_num; $cnt++)
			{$use_litem[$data[$cnt][$MAX_FAIRY*1+$fn+1]] = 1;}
		for ($cnt=0; $cnt < $fn; $cnt++) {$use_litem[$litem[$cnt]] = 1;}
		
		# ラッキーアイテムを求める(算出値が使用中なら再算出)
		while (1) {
			$litem[$fn] = int(rand $MAX_LITEM);
			if ($use_litem[$litem[$fn]] == 0) {last;}
		}
		
		# 使用中キャラソン配列を作成する
		# （配列初期化 / 過去10日分の設定/ 他妖精の本日算出分の設定)
		for ($cnt=0; $cnt < $MAX_LITEM; $cnt++) {$use_sitem[$cnt] = 0;}
		for ($cnt=0; $cnt < $day_num; $cnt++)
			{$use_sitem[ $data[$cnt][$MAX_FAIRY*2+$fn+1] ] = 1;}
		for ($cnt=0; $cnt < $fn; $cnt++) {$use_sitem[0] = 1;}
		
		# キャラソンを求める(算出値が使用中なら再算出)
		while (1) {
			$sitem[$fn] = int(rand $MAX_SITEM);
			if ($use_sitem[$sitem[$fn]] == 0) {last;}
		}
		$use_sitem[$sitem[$fn]] = 1;
	}
	# 本日の結果を1行にまとめる
	$line = sprintf("%d/%d/%d/%02d:%02d:%02d",
		$year, $mon, $mday, $hour, $min, $sec);
	for ($fn=0; $fn < $MAX_FAIRY; $fn++) {$line .= ",$lv[$fn]";}
	for ($fn=0; $fn < $MAX_FAIRY; $fn++) {$line .= ",$litem[$fn]";}
	for ($fn=0; $fn < $MAX_FAIRY; $fn++) {$line .= ",$sitem[$fn]";}
	$line .= "\n";

	# ファイルの先頭に追記する
	unshift(@data_str, $line);
	open(W,">$FILE_NAME") || &sendError(-2);
	print W @data_str;
	close(W);
}

######## (6-2)既アクセス時の占いデータ生成 ####################################
else {
	for($fn=0; $fn < $MAX_FAIRY; $fn++) {
		$lv[$fn]    = int($data[0][$MAX_FAIRY*0+$fn+1]);
		$litem[$fn] = int($data[0][$MAX_FAIRY*1+$fn+1]);
		$sitem[$fn] = int($data[0][$MAX_FAIRY*2+$fn+1]);
	}
}
######## (7)ロック解除 ########################################################
if (-e $LOCK_FILE) {rmdir($LOCK_FILE);}

######## (8)HTTPレスポンス生成 ################################################
print "Content-type: text/plain\n\n";
print "lv=$lv[$number]&litem=$litem[$number]&sitem=$sitem[$number]&flag=$isFirst&crypt=0&result=0";
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
