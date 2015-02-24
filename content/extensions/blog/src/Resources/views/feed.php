<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
	<channel>
		<title><?php echo $siteName; ?></title>
		<description><?php echo $siteDesc; ?></description>		
		<link><?php echo base_url(); ?></link>
		<atom:link href="<?php echo base_url('feed.xml') ?>" rel="self" type="application/rss+xml" />
    <?php foreach ($posts as $post) : ?>
			<item>
				<title><?php echo $post['title']; ?></title>
				<description><![CDATA[<?php echo $post['feed_content']; ?>]]></description>
                <pubDate><?php echo $post['date'] ?></pubDate>
				<link><?php echo $post['url'] ?></link>
				<guid isPermaLink="true"><?php echo $post['url'] ?></guid>
			</item>
    <?php endforeach; ?>
	</channel>
</rss>