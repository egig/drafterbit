<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
	<channel>
		<title><?= $siteName; ?></title>
		<description><?= $siteDesc; ?></description>		
		<link><?= base_url(); ?></link>
		<atom:link href="<?= base_url('feed.xml') ?>" rel="self" type="application/rss+xml" />
    <?php foreach ($posts as $post) : ?>
			<item>
				<title><?= $post['title']; ?></title>
				<description><![CDATA[<?= $post['feed_content']; ?>]]></description>
                <pubDate><?= $post['date'] ?></pubDate>
				<link><?= $post['url'] ?></link>
				<guid isPermaLink="true"><?= $post['url'] ?></guid>
			</item>
    <?php endforeach; ?>
	</channel>
</rss>