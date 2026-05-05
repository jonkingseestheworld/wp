---
layout: post
title:  "My First Object Classification Model: That Ocean Trash Identifier"
date:   2020-09-04 10:00:40
page_class: page-blog
blurb: "A look at an example of object classification model."
og_image: /assets/img/content/post-example/Banner.jpg
---

Do you have a similar experience?

If you also enjoy swimming or paddling in the sea like me, are you sometimes confused or angered when you think you spot a plastic bag floating in the water from afar? Yet when you paddle closer and a just moment before you try to pick it up, you suddenly realise it's a jellyfish. Oooops... good that you haven't touched it, otherwise you could have been stung.

<img src="{{ "/assets/img/content/post-2020/1jellyfish.jpg" | absolute_url }}" alt="1jellyfish" style="height: 210px;">
<img src="{{ "/assets/img/content/post-2020/2plastic.jpg" | absolute_url }}" alt="2plastic" style="height: 210px;">

A situation like this can be tricky even to human sometimes. I wondered how good a machine using Deep Learning algorithm could handle this problem.

<br />

#### <i> The Current Challenge </i>

Following the FastAI approach[^1], I trained a classifier that would distinguish between jellyfish and plastic bags in the sea. (In a future post I will talk about the procedures involved in creating the classifier.)

The results were astounding! The object identifier worked pretty well with previously unseen images.

Here are the outcomes:

<img src="{{ "/assets/img/content/post-2020/outcomes.JPG" | absolute_url }}" alt="classified" style="height: 220px;">

<a href="https://mybinder.org/v2/gh/jonkingseestheworld/plastic_identifier_voila/master?urlpath=voila%2Frender%2Fplastic_identifier_voila2.ipynb" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;"> "That Ocean Trash Identifier!"</a> -- Give it a try yourself?

(Note: The app runs on Binder - a free service that provides hardware and software to run your codes online. It may take a bit of time to load the app when you first visit the page.)

An extension of this project can be working on models that feed on motion pictures - so next time when you are actually out paddling, it advises you whether the floating object afar is a plastic bag or a jellyfish before you pick it up. 

<br />

#### <i> Woman, Man, Camera, TV </i>

Remember this video? When the current President of the United States of America claimed that he was 'cognitively there' and he aced a 'difficult' cognitive test which required him to memorise items like Person, Woman, Man, Camera, TV.

<iframe width="400" height="280" src="https://www.youtube.com/embed/LhZyHIZpzoM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

Simply for fun, I have also built a classifier for identifying Woman, Man, Camera, TV.

(Kudos to JiangHong who came up with this idea originally -- such a genius! I cracked up so much when I first came across <a href="https://juejin.im/post/6865609905508876296" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">this post</a>.)

And here is my attempt: <a href="https://mybinder.org/v2/gh/jonkingseestheworld/WMCTV_voila/master?urlpath=voila%2Frender%2Fwoman_man_camera_tv_voila.ipynb" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;"> "A Woman-Man-Camera-TV Identifier"</a>!

<br />

#### <i> My Thoughts, so far </i>

Overall, <a href="https://github.com/fastai/fastai" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">FastAI</a> library is very user friendly. It is easy to use and understand.

I always thought you needed loads of data to train a good model. FastAI shows that it is not necessarily the case. Given the access to the endless amount of images online, I only needed less than 150 pictures for each object type (plastic bag / jelly fish) at the end  to get an almost-perfect classifier. 

Data cleaning is an important process. Model predictions are depedent and influenced by training data. (This point will be further discussed in the last section.) From my experience, the act of cleaning the data is still very labor intensive. I would want to know more how companies tackle that issue in real-life practice.

<br />

#### <i> Caveats about these classifiers </i>

Deep Learning is not everything. It certainly has limitations.

1. Predictions can be largely influenced by the training data. That is, what can be predicted is constrained by the data you put into the model to train.

2. In other words, the model can be biased. When I started developing the 'Woman-Man-Camera-TV' classifier, I realised it constantly mis-identified men wearing caps /head accessories, or women with skin head ... So at the very beginning I had to go back and fro to check to make sure the image set would comprise examples that represent a good diversity of people. (See also the chapter on Data Ethics in FastAI[^2].

3. This is a very simple classifier I built. It treats a whole image as a single entity. So, if you have both plastic bag and jelly fish in the same picture, the classifier may struggle to tell you which one exists. 

<b>It's only a few weeks in my learning journey with FastAI. I am having so much fun already and there are a lot of ideas popping up in my mind. </b>

<br />
##### FOOTNOTES
[^1]: <a href="https://course.fast.ai/" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;"> FastAI course 2020</a>

[^2]: <a name="ref2" href="https://ethics.fast.ai/" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">Practical Data Ethics, FastAI</a>
