---
course: 数据库设计与开发
credit: 3
semester: 大二下
author: Reina
teacher: 赵小林
courseRating: 3
teacherRating: 0


difficulty: hard
status: published

date: 2025-06-27
lastUpdated: 2025-08-22

tags: 
  - 大二下
  - 计算机学院
  - 专业必修课
grades:
  maxScore: 100
  avgScore: 80.16
  myScore: 99
  classPercentile: 22
  majorPercentile: 12
  overallPercentile: 15
materialLinks:
  - url: https://ri-nai-bit-se.github.io/Database-zxl-Notes/paper/2022.html
    title: 网传 2022 年试卷
noteLinks:
  - url: https://ri-nai-bit-se.github.io/Database-zxl-Notes/
    title: 课程笔记

---


# 数据库设计与开发

:::details 出分后更新
这byd给分怎么这么高

不过我自己只有 99 分，感觉是因为提交加分申请太早了导致他没统计上，或者因为我最后两次睡过头了没交实验报告导致的。我其实感觉我自己写的还行。
:::

臭名昭著的一门课，软件工程的两个老师这门课的风评都比较一般。
按照往常惯例的话 01 和 02 班会分到赵小林老师， 03 和 04 会分到单纯老师。  
~~以后的话可能是特立软工的课会分到赵小林老师~~

## 课程内容
大致可以看看我的笔记或者课件，课件质量是我见过最烂的一档，学习过程非常痛苦。
笔记：https://ri-nai-bit-se.github.io/Database-zxl-Notes/


## 考核内容


应该不怎么考勤，我印象里也就点了两次名。

| Type | Points |
|------|--------|
| Experiments | 10 |
| Assignments | 40 |
| Exam | 50 |
| Extra | <=20 |

其实我也不太懂 Experiments 和 Assignments 的实际区别是什么，感觉都是根据实验做实验报告的那种。

平时的实验和作业的核心就是学会使用 **OpenGauss** 数据库，以及学会使用 SQL 语言。

由于 **OpenGauss** 其实是由华为在 **PostgreSQL** 的基础上开发的一个数据库，所以 SQL 语言的语法和 **PostgreSQL** 基本一致，更重要的是，其实 **OpenGauss** 能兼容很多 **PostgreSQL** 的工具。

举个例子：我主要是用的两个工具是 `DataGrip` 和 `psql`。  

`DataGrip` 是 JetBrains 家的数据库工具，支持连接到 `PostgreSQL`类型的数据库，你只需要选择连接到 `PostgreSQL` 类型，填入自己的 `OpenGauss` 数据库的连接信息，就可以直接连接到 `OpenGauss` 数据库。

`psql` 是 `PostgreSQL` 的命令行工具，你只需要在命令行中输入 `psql -h <host> -p <port> -U <username> -d <database>` 就可以连接到 `OpenGauss` 数据库。

利用这个命令行工具，可以省去一步到虚拟机的步骤，直接在 Windows 的终端里用 `psql` 操作数据库，因为通常来说 Windows 的终端会比虚拟机里操作更好用。

只要了解这一个小技巧做前几个实验就很简单了。

因为现在学生习惯用 AI 写实验报告，如果你问 AI `OpenGauss` 的语法的话可能会回答错误的，但是如果你问 AI 怎么用 `PostgreSQL` 的语法写 `OpenGauss` 的语法的话，AI 给的的回答大概率是正确的。

### Experiments

Experiments 会给相应的指导手册，还是比较好操作的。

#### 1. 建立数据库

主要是学会 云服务器 / 虚拟机 上建立 **OpenGauss** 数据库。

涵盖终端操作、ssh、虚拟机建立、服务器运用等多个实际运用上比较麻烦的点，配置环境还是比较麻烦的。

有一说一这个实验其实是花费我比较多的时间，因为需要配置环境，包括 `OpenEuler` 和 `OpenGauss` 的几个系统配置。（一开始想用 `CentOS` 的，但是好像只有老版本支持，用起来更麻烦了）

#### 2. 数据库基本操作

还算简单，主要是学会使用 SQL 语言增删改查。

#### 3. 数据库物理设计

涉及到 Schema、分区、权限管理之类的。

#### 4. 视图、存储过程、触发器

这几个算比较难的语法，如果你对着 `OpenGauss` 文档学语法的话，可能会很难受，但是用之前推荐的方法去问 LLM 的话会舒服很多。

### Assignment

#### 1. 数据库高级管理

主要涉及到备份、错误排查，也是参照指南的，不参照指南的话要求给的太不明晰了。

#### 2. 学科字典

建立一个学科字典，要求视图做成多层级的动态交叉表，难度较高。

个人的方案是建树、递归（高级sql）

#### 3. 数据库设计与应用

最恶心的一个作业。

要求就是至少设计多少个表、视图、存储过程、触发器、高级sql运用等。

然后需要做前后端。

如果知识单纯这样的话还是比较好水的，但是加分项是使用 `delphi` 来同时制作前后端。这门语言非常老，而且很难用 AI 来辅助编码，开发过程非常痛苦。

后面破罐子破摔了，有很多bug还是直接交了，毕竟这种项目虽然对我们来说开发很久，在老师眼里就是一次性的。

#### 4. 研究性学习

写一篇论文，很好水过去。

### Exam

考试，占比最大的但是感觉影响也没那么大。

知识点很杂，加上zxl特有的啥比ppt，只能自求多福了

今年的卷子的主观题和一份在树洞上要来的2022年的卷子，题目差不多，可以稍微参考。

2022 年试卷：https://ri-nai-bit-se.github.io/Database-zxl-Notes/paper/2022.html


### Extra

1. Experiments / Assignments 的加分
  - 纸质加分申请，无须手抄，印制即可。
  - delphi
2. Homework
  赵小林每节课上会有意无意的给大家留 Homework，邮箱投递

额外加分比较未知，基本奠定了你的分数，因为感觉大家做试卷都很烂，但是出分都是99、100