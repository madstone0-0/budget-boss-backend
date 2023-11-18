--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2023-11-18 09:46:39 GMT

--
-- TOC entry 215 (class 1259 OID 16534)
-- Name: budget; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.budget (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name character varying NOT NULL,
    date_added date NOT NULL,
    amount numeric(18,8) NOT NULL,
    category_id integer NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 16540)
-- Name: category; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.category (
    category_id integer NOT NULL,
    user_id uuid,
    name character varying NOT NULL,
    color character varying
);


--
-- TOC entry 217 (class 1259 OID 16545)
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2668 (class 0 OID 0)
-- Dependencies: 217
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.category.category_id;


--
-- TOC entry 218 (class 1259 OID 16546)
-- Name: user; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public."user" (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    salt character varying NOT NULL,
    passhash character varying NOT NULL,
    has_created_budget boolean DEFAULT false NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16553)
-- Name: user_budget; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.user_budget (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    budget_options jsonb NOT NULL
);


--
-- TOC entry 2499 (class 2604 OID 16587)
-- Name: category category_id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.category ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- TOC entry 2657 (class 0 OID 16534)
-- Dependencies: 215
-- Data for Name: budget; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.budget (id, user_id, name, date_added, amount, category_id) FROM stdin;
98fe7d63-3b25-4b25-afd4-e29b0fa3249f	9b61e8bf-211b-4f55-9253-37e932c9ec65	Budget 1	2023-10-06	-28362.00000000	11
b8dff2d0-7bdb-40d2-9afe-d19be7d0ca8c	ee2994a1-1f5c-4b85-b24d-bf52e82add62	Forgis	2023-10-09	0.00000000	19
f658b9d4-4f8a-4ab9-a8f2-e11b80ecefed	ee2994a1-1f5c-4b85-b24d-bf52e82add62	Forgis	2023-10-09	0.00000000	19
6e999da8-fb81-4a9e-a93a-e1e8ff45ba99	ee2994a1-1f5c-4b85-b24d-bf52e82add62	Forgis	2023-10-09	0.00000000	17
9cdd3555-55da-469c-8b82-25c192827045	ee2994a1-1f5c-4b85-b24d-bf52e82add62	Forgis	2023-10-09	0.00000000	19
b2c452a6-64eb-4947-bfbb-7a8538daa748	95557782-94ff-4246-b1a8-d2af0222c080	Stuff	2023-09-20	232.00000000	34
adeeafab-28e1-48a2-9756-8e59eb33511a	dcb88a99-ba5d-4121-8fda-f72e98341d40	KFC	2023-10-11	-120.00000000	41
bd4a0a8b-d04c-4338-9b67-b8692f242547	3f395e32-ede3-4602-ad68-67c136b51ee3	First spend	2023-10-12	100.00000000	51
d7980d00-88e6-497d-83f4-f5e00d857297	9a8440c3-1dd3-4581-85a8-856558f3e272	Shopping amount	2023-10-11	2500.00000000	33
1ec8af0f-6243-4db5-bc4f-beeebfc84449	9a8440c3-1dd3-4581-85a8-856558f3e272	Food 	2023-10-14	-1750.00000000	25
5a770da7-1a82-4d9c-80af-d3801e4007e5	95557782-94ff-4246-b1a8-d2af0222c080	Expenses	2023-10-11	-30000.00000000	34
59ec0e22-0abc-4c2f-87ef-62df48dbee88	95557782-94ff-4246-b1a8-d2af0222c080	ballin	2023-10-15	356532.00000000	35
c68dd467-1141-4432-a365-0f12a33a053d	3d748dc1-c3cc-4c78-85fc-c3f835d0f425	Sales	2023-10-16	10.00000000	89
b848c22d-c643-41c9-a431-419b48c5bf56	2e3a507b-d89d-4ee0-8838-7c630c9e9409	Phone	2023-10-16	350.00000000	82
\.


--
-- TOC entry 2658 (class 0 OID 16540)
-- Dependencies: 216
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.category (category_id, user_id, name, color) FROM stdin;
7	7815acda-5176-41a1-bfa6-2e490a508ff7	Shopping	#2567F9
8	7815acda-5176-41a1-bfa6-2e490a508ff7	Food	#FF3C82
9	7815acda-5176-41a1-bfa6-2e490a508ff7	Health	#2567F9
10	9b61e8bf-211b-4f55-9253-37e932c9ec65	Shopping	#2567F9
11	9b61e8bf-211b-4f55-9253-37e932c9ec65	Health	#2567F9
12	9b61e8bf-211b-4f55-9253-37e932c9ec65	Food	#FF3C82
14	433c8487-7679-4982-b2eb-7aa32a080ead	Health	#2567F9
15	433c8487-7679-4982-b2eb-7aa32a080ead	Food	#FF3C82
19	ee2994a1-1f5c-4b85-b24d-bf52e82add62	Health	#263046
17	ee2994a1-1f5c-4b85-b24d-bf52e82add62	Shopping	#7e7843
91	8d262ce1-3d0f-47fc-9e14-45f1524f7d2e	Shopping	#E4D00A
92	8d262ce1-3d0f-47fc-9e14-45f1524f7d2e	Health	#2567F9
20	c71baae1-4cf5-4542-9755-1ff210659ab6	Shopping	#E4D00A
21	c71baae1-4cf5-4542-9755-1ff210659ab6	Food	#FF3C82
22	c71baae1-4cf5-4542-9755-1ff210659ab6	Health	#2567F9
25	9a8440c3-1dd3-4581-85a8-856558f3e272	Food	#FF3C82
93	8d262ce1-3d0f-47fc-9e14-45f1524f7d2e	Food	#FF3C82
26	79512019-f12a-4b2c-bf51-8b653798fa46	Shopping	#E4D00A
27	79512019-f12a-4b2c-bf51-8b653798fa46	Health	#2567F9
28	79512019-f12a-4b2c-bf51-8b653798fa46	Food	#FF3C82
32	9a8440c3-1dd3-4581-85a8-856558f3e272	Other 	#000
94	3022b046-6803-454a-9c8b-97c057a40224	Shopping	#E4D00A
95	3022b046-6803-454a-9c8b-97c057a40224	Food	#FF3C82
96	3022b046-6803-454a-9c8b-97c057a40224	Health	#2567F9
83	2e3a507b-d89d-4ee0-8838-7c630c9e9409	Food	#FF3C82
23	9a8440c3-1dd3-4581-85a8-856558f3e272	Shopping	#7109e3
33	9a8440c3-1dd3-4581-85a8-856558f3e272	Investments	#06d5e0
36	f62b8ffa-64fd-4d0d-b3b3-13a53f16551d	Shopping	#E4D00A
37	f62b8ffa-64fd-4d0d-b3b3-13a53f16551d	Health	#2567F9
38	f62b8ffa-64fd-4d0d-b3b3-13a53f16551d	Food	#FF3C82
39	dcb88a99-ba5d-4121-8fda-f72e98341d40	Shopping	#E4D00A
41	dcb88a99-ba5d-4121-8fda-f72e98341d40	Food	#FF3C82
40	dcb88a99-ba5d-4121-8fda-f72e98341d40	Health	#2567F9
42	09d98393-0c47-431e-8630-38d5248f25d0	Shopping	#E4D00A
43	09d98393-0c47-431e-8630-38d5248f25d0	Health	#2567F9
44	09d98393-0c47-431e-8630-38d5248f25d0	Food	#FF3C82
13	433c8487-7679-4982-b2eb-7aa32a080ead	Shopping	#E4D00A
45	1e4b0a31-94f6-4250-a96e-8f5300fe62ea	Shopping	#E4D00A
46	1e4b0a31-94f6-4250-a96e-8f5300fe62ea	Food	#FF3C82
47	1e4b0a31-94f6-4250-a96e-8f5300fe62ea	Health	#2567F9
48	e35bd952-1d16-4e87-93c2-f79839f771d1	Shopping	#E4D00A
49	e35bd952-1d16-4e87-93c2-f79839f771d1	Health	#2567F9
50	e35bd952-1d16-4e87-93c2-f79839f771d1	Food	#FF3C82
51	3f395e32-ede3-4602-ad68-67c136b51ee3	moving	#8b5555
52	a5f5c089-dbf9-41f8-b515-bec177736563	Shopping	#E4D00A
53	a5f5c089-dbf9-41f8-b515-bec177736563	Food	#FF3C82
54	a5f5c089-dbf9-41f8-b515-bec177736563	Health	#2567F9
55	12c03183-b119-4899-8fcb-a01a47a07f27	Shopping	#E4D00A
56	12c03183-b119-4899-8fcb-a01a47a07f27	Health	#2567F9
57	12c03183-b119-4899-8fcb-a01a47a07f27	Food	#FF3C82
58	2a81fabf-2398-4c0b-91f1-a78c845a6df7	Shopping	#E4D00A
59	2a81fabf-2398-4c0b-91f1-a78c845a6df7	Health	#2567F9
60	2a81fabf-2398-4c0b-91f1-a78c845a6df7	Food	#FF3C82
61	22aacd9f-f612-410f-b4d1-9f3bef803e2e	Shopping	#E4D00A
62	22aacd9f-f612-410f-b4d1-9f3bef803e2e	Health	#2567F9
63	22aacd9f-f612-410f-b4d1-9f3bef803e2e	Food	#FF3C82
67	38fbaba7-f37f-4d58-b9c9-2092e5f9f1c5	Shopping	#E4D00A
68	38fbaba7-f37f-4d58-b9c9-2092e5f9f1c5	Food	#FF3C82
69	38fbaba7-f37f-4d58-b9c9-2092e5f9f1c5	Health	#2567F9
70	c3a4e0b9-8121-4364-a809-4d9e7ffe50db	Shopping	#E4D00A
71	c3a4e0b9-8121-4364-a809-4d9e7ffe50db	Food	#FF3C82
72	c3a4e0b9-8121-4364-a809-4d9e7ffe50db	Health	#2567F9
73	7a3f6a87-2737-4f70-aa41-b610fb64c861	Shopping	#E4D00A
74	7a3f6a87-2737-4f70-aa41-b610fb64c861	Health	#2567F9
75	7a3f6a87-2737-4f70-aa41-b610fb64c861	Food	#FF3C82
76	c56724d9-019e-4420-8a7f-59ec0e7ac10f	Shopping	#E4D00A
77	c56724d9-019e-4420-8a7f-59ec0e7ac10f	Health	#2567F9
78	c56724d9-019e-4420-8a7f-59ec0e7ac10f	Food	#FF3C82
24	9a8440c3-1dd3-4581-85a8-856558f3e272	Health	#2567F9
79	ac0779ad-1698-453f-b6d4-3fc857cf08b7	Shopping	#E4D00A
80	ac0779ad-1698-453f-b6d4-3fc857cf08b7	Food	#FF3C82
81	ac0779ad-1698-453f-b6d4-3fc857cf08b7	Health	#2567F9
34	95557782-94ff-4246-b1a8-d2af0222c080	School	#3c5869
35	95557782-94ff-4246-b1a8-d2af0222c080	Other	#9a248a
82	2e3a507b-d89d-4ee0-8838-7c630c9e9409	Shopping	#E4D00A
84	2e3a507b-d89d-4ee0-8838-7c630c9e9409	Health	#2567F9
85	ee71e3f5-4bfe-4f18-9657-39f3c81c0a72	Health	#2567F9
86	ee71e3f5-4bfe-4f18-9657-39f3c81c0a72	Shopping	#E4D00A
87	ee71e3f5-4bfe-4f18-9657-39f3c81c0a72	Food	#FF3C82
88	3d748dc1-c3cc-4c78-85fc-c3f835d0f425	Shopping	#E4D00A
89	3d748dc1-c3cc-4c78-85fc-c3f835d0f425	Food	#FF3C82
90	3d748dc1-c3cc-4c78-85fc-c3f835d0f425	Health	#2567F9
\.


--
-- TOC entry 2660 (class 0 OID 16546)
-- Dependencies: 218
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public."user" (user_id, email, salt, passhash, has_created_budget) FROM stdin;
9a8440c3-1dd3-4581-85a8-856558f3e272	ronellecudjoe9@gmail.com	$2b$10$ORL61l/M5YXwwmgqQadbfO	$2b$10$ORL61l/M5YXwwmgqQadbfOOR0oHHKTpGN4PufWO2dfqbna27Me8JG	t
ac0779ad-1698-453f-b6d4-3fc857cf08b7	mawulimensah540@gmail.com	$2b$10$4Cmw86Ua4qOaJVnDzfw3UO	$2b$10$4Cmw86Ua4qOaJVnDzfw3UOvQ/p6niBZswSS8U.Ge2BAtktmiWAW8m	f
433c8487-7679-4982-b2eb-7aa32a080ead	kilozmary@gmail.com	$2b$10$dNGKkUOD9FrhoXmIoCbZae	$2b$10$dNGKkUOD9FrhoXmIoCbZael6cr4XjM8kiabqzyBqIDqJ4AanzVclO	t
2e3a507b-d89d-4ee0-8838-7c630c9e9409	akwasianane01@gmail.com	$2b$10$QhqvBFYfPmPFtj8QSLRpf.	$2b$10$QhqvBFYfPmPFtj8QSLRpf.x8LghJr9C5Q.3Cy3HtOWiWWD/kdX32m	t
1e4b0a31-94f6-4250-a96e-8f5300fe62ea	enochblay07@gmail.com	$2b$10$ThIxfHko6lJs841UOVjvoO	$2b$10$ThIxfHko6lJs841UOVjvoOaK0ee3HCDuGVIAYnLIM1A2MmNZBLU86	t
e35bd952-1d16-4e87-93c2-f79839f771d1	kwasiarhu@gmail.com	$2b$10$hPJoyZVuoQ7O6DQ5iodxZe	$2b$10$hPJoyZVuoQ7O6DQ5iodxZehFldcPz2NJusbJsIRkYzIns8IAXFHVe	f
ee71e3f5-4bfe-4f18-9657-39f3c81c0a72	fadzai.z@usapschool.org	$2b$10$8QqSmhMIwhXziYdE2u2gPO	$2b$10$8QqSmhMIwhXziYdE2u2gPOkelZ.8zj4Yf.L1sGDdC/0QdSaREbXRq	f
8d262ce1-3d0f-47fc-9e14-45f1524f7d2e	comfortasibi06@gmail.com	$2b$10$ftEu/JGMx8N5UfSKJjfLMO	$2b$10$ftEu/JGMx8N5UfSKJjfLMOnuYnqpSMxfL1TGG3juweZgFAuWbVp4S	f
3f395e32-ede3-4602-ad68-67c136b51ee3	akwasianane03@gmail.com	$2b$10$wwCCRATebZEd8Sb6qZ5i.e	$2b$10$wwCCRATebZEd8Sb6qZ5i.eiGpND5J2OrX7rrgdBnL5mZy573643YW	t
a5f5c089-dbf9-41f8-b515-bec177736563	shammah.dzwairo@ashesi.edu.gh	$2b$10$7m53IjJQKHB6wDnKl1iiS.	$2b$10$7m53IjJQKHB6wDnKl1iiS.KWjB06Zl/AaDdYk2onuTM79qLgxM2Ka	f
12c03183-b119-4899-8fcb-a01a47a07f27	esterina.khoboso@ashesi.edu.gh	$2b$10$Usq33tZRaiUEJSkIngDGne	$2b$10$Usq33tZRaiUEJSkIngDGneQwI1ozfAazP0MUPf0e8uy2G9r4qF7cy	f
2a81fabf-2398-4c0b-91f1-a78c845a6df7	lopeyokcharles27@gmail.com	$2b$10$bE22epCQGj.r0rRjj2lbye	$2b$10$bE22epCQGj.r0rRjj2lbyeW1f2uHemuQ.MJspJJ7BDf.xrUDL30HC	f
22aacd9f-f612-410f-b4d1-9f3bef803e2e	mbarcaking@gmail.com	$2b$10$xAhHHnf3Mih78.vx3wFkMe	$2b$10$xAhHHnf3Mih78.vx3wFkMe9h1GR74POBdSF2b/W9ZSa17wg7FoOYa	t
3d748dc1-c3cc-4c78-85fc-c3f835d0f425	roselinetsatsu@gmail.com	$2b$10$AqNrn.BFhrQFqkGGBfbQN.	$2b$10$AqNrn.BFhrQFqkGGBfbQN.krOdjHccj34EDTuYrL1j9IMnwFpw/oq	t
7815acda-5176-41a1-bfa6-2e490a508ff7	hkiskoki1213@gmail.com	$2b$10$NLutYaUQvCnl5YBnX8hGaO	$2b$10$NLutYaUQvCnl5YBnX8hGaOJ1vPhkA2xLexXPsKpdfryZIS0kp6y2G	f
9b61e8bf-211b-4f55-9253-37e932c9ec65	madibahq@gmail.com	$2b$10$ca/mTZCVoxJZxPyKlU9cne	$2b$10$ca/mTZCVoxJZxPyKlU9cneU/3.ZIVEeWeSAX8WHLLEwbR5yCnbaVC	f
3022b046-6803-454a-9c8b-97c057a40224	annieaddison2020@gmail.com	$2b$10$q5JtzRtgp6jbvjsDsJubUe	$2b$10$q5JtzRtgp6jbvjsDsJubUeTdBRmBHafUeJ8fiYUsbOL59hQt5sq52	f
ee2994a1-1f5c-4b85-b24d-bf52e82add62	bendover@gmail.com	$2b$10$VTYQLVjS9gDlc/3oPAu5Ee	$2b$10$VTYQLVjS9gDlc/3oPAu5EesCSaRMwuWcmSX.hU6niNC2O5wqnxIhW	f
c71baae1-4cf5-4542-9755-1ff210659ab6	bernicehanson2004@gmail.com	$2b$10$yLvlhN6v5.FGrunTtq4XRe	$2b$10$yLvlhN6v5.FGrunTtq4XRehOLHORCEnzlxJRMCkbebP5aHblcl312	f
09d98393-0c47-431e-8630-38d5248f25d0	asareadwoaafi233@gmail.com	$2b$10$asa1notNmZuX5txmmTZfke	$2b$10$asa1notNmZuX5txmmTZfke/ZeJcNI3N/ibB1e9lD21j3wQFEFr9hS	f
f62b8ffa-64fd-4d0d-b3b3-13a53f16551d	madstonereturns@gmail.com	$2b$10$mKTiHzJ9.TGI46ktS4kDpu	$2b$10$mKTiHzJ9.TGI46ktS4kDpu3HrkVyh2OZgkcFErxrds88iY4hRLOFS	f
dcb88a99-ba5d-4121-8fda-f72e98341d40	amyfrancs@yahoo.com	$2b$10$CGzvgoqKdxEEA.IWJqrbMO	$2b$10$CGzvgoqKdxEEA.IWJqrbMOB5na9UUY30y3DjlvNRlpbxGUSHOMBRq	f
95557782-94ff-4246-b1a8-d2af0222c080	mhquansah@gmail.com	$2b$10$YuaAfx/owV6QLUw5rdQCs.	$2b$10$YuaAfx/owV6QLUw5rdQCs.Rx/xfRD1BxQHobQEmKv/LEddVpcXL8u	t
38fbaba7-f37f-4d58-b9c9-2092e5f9f1c5	hilarykwofie1213@gmail.com	$2b$10$7RjLhn6O.nL3YwJWPPzfFu	$2b$10$7RjLhn6O.nL3YwJWPPzfFursAnUB8ZcIlYWMOICBxo1LHukIkRdwy	t
79512019-f12a-4b2c-bf51-8b653798fa46	paakorsah1@gmail.com	$2b$10$/4K/m9HJae5zf4IZd0fMPe	$2b$10$/4K/m9HJae5zf4IZd0fMPerHjWZezUOVhtImyo7Qe53wd47agosR6	t
c3a4e0b9-8121-4364-a809-4d9e7ffe50db	kwofie27@gmail.com	$2b$10$OhlvpJToOURqzBkroipHge	$2b$10$OhlvpJToOURqzBkroipHgeGHx8HAr2j.zgrkfuSDzETH/NZHClfva	f
7a3f6a87-2737-4f70-aa41-b610fb64c861	tagoeian@gmail.com	$2b$10$Sz06sCwwpbw.Q4LohH.5nu	$2b$10$Sz06sCwwpbw.Q4LohH.5nuQyOtnVP/3acFaKMYHcLzMogGGjfjj/m	f
c56724d9-019e-4420-8a7f-59ec0e7ac10f	dquecci@gmail.com	$2b$10$mwdPNZ99hBQfVBjyYenBbO	$2b$10$mwdPNZ99hBQfVBjyYenBbO6Sawchg0tMwvTEpdAk6j.hsxKMQ8tbm	f
\.


--
-- TOC entry 2661 (class 0 OID 16553)
-- Dependencies: 219
-- Data for Name: user_budget; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.user_budget (id, user_id, budget_options) FROM stdin;
f07aaf9c-3a45-44f0-a8fe-888cf83d513b	95557782-94ff-4246-b1a8-d2af0222c080	{"income": 1000, "options": [{"weight": 50, "category": {"name": "Drugs", "color": "#1c9847"}}, {"weight": 50, "category": {"name": "More drugs", "color": "#57d6ec"}}]}
06c92a17-81db-4b9e-8058-fd4c9c914603	1e4b0a31-94f6-4250-a96e-8f5300fe62ea	{"income": 4000, "options": [{"weight": 100, "category": {"name": "Milk", "color": "#000000"}}]}
e6b32db6-f9f0-4b5b-abe3-65918634b2a8	3f395e32-ede3-4602-ad68-67c136b51ee3	{"income": 1000, "options": [{"weight": 40, "category": {"name": "Food", "color": "#000000"}}, {"weight": 30, "category": {"name": "Entertainment", "color": "#000000"}}, {"weight": 20, "category": {"name": "Saving", "color": "#000000"}}, {"weight": 10, "category": {"name": "Investment ", "color": "#000000"}}]}
4addc2ac-f46e-4e93-9b36-70e4c7dffd41	3f395e32-ede3-4602-ad68-67c136b51ee3	{"income": 900, "options": [{"weight": 40, "category": {"name": "Food", "color": "#000000"}}]}
c7d6fdfe-8a6b-4816-9a69-95ba20f85fd4	22aacd9f-f612-410f-b4d1-9f3bef803e2e	{"income": 100, "options": [{"weight": 40, "category": {"name": "weight", "color": "#000000"}}, {"weight": 60, "category": {"name": "food", "color": "#000000"}}]}
4eb01bd8-3aab-472f-893e-ffbe3dc4b7f0	38fbaba7-f37f-4d58-b9c9-2092e5f9f1c5	{"income": 180, "options": [{"weight": 50, "category": {"name": "Outing ", "color": "#fb00ff"}}, {"weight": 40, "category": {"name": "Calculator ", "color": "#8308d7"}}]}
8dc0256c-af16-442b-88bd-86914b5ceae7	79512019-f12a-4b2c-bf51-8b653798fa46	{"income": 5000, "options": [{"weight": 50, "category": {"name": "Food", "color": "#ff0202"}}]}
4d68291c-8122-47bb-bc31-497b7576773a	9a8440c3-1dd3-4581-85a8-856558f3e272	{"income": 1000, "options": [{"weight": 50, "category": {"name": "Groceries ", "color": "#320ab4"}}, {"weight": 20, "category": {"name": "Food", "color": "#fcbf05"}}]}
2f517b69-c60f-46c2-b072-535ac6e43cc7	9a8440c3-1dd3-4581-85a8-856558f3e272	{"income": 2500, "options": [{"weight": 25, "category": {"name": "Food", "color": "#05a982"}}, {"weight": 55, "category": {"name": "Shopping", "color": "#6a03d2"}}]}
f7840e80-498c-41f7-a485-ecdc01907ed3	2e3a507b-d89d-4ee0-8838-7c630c9e9409	{"income": 9000, "options": [{"weight": 40, "category": {"name": "Entertainment", "color": "#c33b3b"}}]}
c67170c5-a637-4d38-93b3-99bd9ad84cf1	3d748dc1-c3cc-4c78-85fc-c3f835d0f425	{"income": 80, "options": [{"weight": 20, "category": {"name": "Entertainment ", "color": "#ff0808"}}, {"weight": 60, "category": {"name": "Food ", "color": "#ff1c1c"}}, {"weight": 20, "category": {"name": "Transport", "color": "#ff0202"}}]}
\.


--
-- TOC entry 2669 (class 0 OID 0)
-- Dependencies: 217
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 96, true);


--
-- TOC entry 2504 (class 2606 OID 16560)
-- Name: budget budget_pk; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_pk PRIMARY KEY (id);


--
-- TOC entry 2506 (class 2606 OID 16562)
-- Name: category category_pk; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pk PRIMARY KEY (category_id);


--
-- TOC entry 2510 (class 2606 OID 16564)
-- Name: user_budget user_budget_pk; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_budget
    ADD CONSTRAINT user_budget_pk PRIMARY KEY (id);


--
-- TOC entry 2508 (class 2606 OID 16566)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2511 (class 2606 OID 16567)
-- Name: budget budget_fk; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_fk FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2512 (class 2606 OID 16572)
-- Name: budget budget_fk_1; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.budget
    ADD CONSTRAINT budget_fk_1 FOREIGN KEY (category_id) REFERENCES public.category(category_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 2513 (class 2606 OID 16577)
-- Name: category category_fk; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_fk FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2514 (class 2606 OID 16582)
-- Name: user_budget user_budget_fk; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.user_budget
    ADD CONSTRAINT user_budget_fk FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


-- Completed on 2023-11-18 09:49:31 GMT

--
-- PostgreSQL database dump complete
--

