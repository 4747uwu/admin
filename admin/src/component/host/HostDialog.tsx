import Button from "@/extra/Button";
import { ExInput, Textarea } from "@/extra/Input";
import { closeDialog } from "@/store/dialogSlice";
import { createGiftCategory, getGiftCategory, updateGiftCategory } from "@/store/giftSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import React, { useEffect, useState } from "react";
import ReactSelect from 'react-select';
import { useSelector } from "react-redux";
import { color } from "html2canvas/dist/types/css/types/color";
import { createAgency } from "@/store/agencySlice";
import { genderData } from "@/utils/extra";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactDropzone, { FileWithPath, Accept } from "react-dropzone";
import moment, { lang } from "moment";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
    IconButton,
} from "@mui/material";
import { baseURL } from "@/utils/config";
import { createHost, getImpression, updateHost } from "@/store/hostSlice";
import Select from "react-select";
import countriesData from '@/api/countries.json';


interface ErrorState {
    name: string;
    email: string;
    Dob: string;
    language: string;
    impression: string;
    country: string;
    image: string;
    bio: string;
    gender: string;
    images: string;
    video: string
}
const HostDialog = () => {
   
    const [startDate, setStartDate] = useState(moment().format('DD/MM/YYYY')); // Set a valid date format
    const { impressionList } = useSelector((state: RootStore) => state.host)
    const [countryOptions, setCountryOptions] = useState<any[]>([]); // All countries
    const [selectedCountry, setSelectedCountry] = useState<any>(null); // Selected country
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [Dob, setDob] = useState("");
    const [language, setLanguage] = useState("");
    const [countryDataSelect, setCountryDataSelect] = useState<any>({});
    const [imagePath, setImagePath] = useState<string>();
    const [impression, setImpression] = useState<string[]>([]);
    const [videoPath, setVideoPath] = useState<any>(null);
    const [thumbnail, setThumbnail] = useState<File[]>([]);
    const [thumbnailKey, setThumbnailKey] = useState<number>(0);
    const [image, setImage] = useState();
    const [gender, setGender] = useState("");
    const [bio, setBio] = useState("");
    const [loadingCountries, setLoadingCountries] = useState(false)

    const [images, setImages] = useState<File[]>([]);
    const [video, setVideo] = useState<{
        file: File | null;
        thumbnailBlob: File | null;
    }>({
        file: null,
        thumbnailBlob: null,
    });


    const { dialogue, dialogueData } = useSelector(
        (state: RootStore) => state.dialogue
    );
    useEffect(() => {
        if (dialogueData?.dob) {
            const parsedDate = moment(dialogueData.dob, 'DD/MM/YYYY', true); // strict parsing
            if (parsedDate.isValid()) {
                setStartDate(parsedDate.format('DD/MM/YYYY'));
            } else {
                setStartDate('');
            }
        }
    }, [dialogueData]);




    useEffect(() => {
        if (dialogueData) {
            setEmail(dialogueData?.email);
            setGender(dialogueData?.gender);
            setBio(dialogueData?.bio);
            setImagePath(baseURL + dialogueData?.image);
            setImages(dialogueData?.photoGallery?.map((item: any) => item));
            setLanguage(dialogueData?.language);
            setVideoPath(baseURL + dialogueData?.video)
            let impressionArray: string[] = [];
            if (Array.isArray(dialogueData?.impression)) {
                impressionArray = dialogueData.impression.flatMap((item: string) =>
                    item.split(',').map((name) => name.trim())
                );
            } else if (typeof dialogueData?.impression === 'string') {
                impressionArray = dialogueData.impression.split(',').map((name: any) => name.trim());
            }
            const matchImpressionNames = impressionList?.map((item: any) => item?.name?.trim());
            const matchedNames = matchImpressionNames?.filter((name: string) =>
                impressionArray.includes(name)
            );
            setImpression(matchedNames || []);

        }
    }, [dialogueData, impressionList]);


    useEffect(() => {
        const processCountries = () => {
            setLoadingCountries(true)

            try {
                // Transform countries to React Select format
                const transformedCountries = countriesData
                    .filter(country =>
                        country.name?.common &&
                        country.cca2 &&
                        country.flags?.png
                    )
                    .map(country => ({
                        value: country.cca2, // Required by React Select
                        label: country.name.common, // Required by React Select
                        name: country.name.common,
                        code: country.cca2,
                        flagUrl: country.flags.png || country.flags.svg,
                        flag: country.flags.png || country.flags.svg // For compatibility
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label))

                setCountryOptions(transformedCountries)

                // Set default or existing country
                if (dialogueData?.country) {
                    const existingCountry = transformedCountries.find(
                        (c: any) => c.name.toLowerCase() === dialogueData.country.toLowerCase()
                    );
                    setSelectedCountry(existingCountry || null);
                } else {
                    // Set India as default
                    const defaultCountry = transformedCountries.find((c: any) => c.name === "India");
                    setSelectedCountry(defaultCountry || transformedCountries[0] || null);
                }
            } catch (error) {
                console.error('Failed to process countries:', error)
            } finally {
                setLoadingCountries(false)
            }
        }

        processCountries()
    }, [dialogueData])


    useEffect(() => {
        dispatch(getImpression())
    }, []);

    useEffect(() => {
        setName(dialogueData?.name)
    }, [dialogueData])


    const dispatch = useAppDispatch();

    const [error, setError] = useState({
        name: "",
        email: "",
        Dob: "",
        language: "",
        country: "",
        image: "",
        impression: "",
        gender: "",
        bio: "",
        images: "",
        video: ""
    });

    const CustomOption = ({ innerRef, innerProps, data }: any) => (
        <div ref={innerRef} {...innerProps} className="optionShow-option p-2 d-flex align-items-center">
            <img
                height={24}
                width={32}
                alt={data.name}
                src={data.flagUrl}
                className="me-2"
                style={{ objectFit: 'cover' }}
            />
            <span>{data.label}</span>
        </div>
    )

    const handleChange = (date: Date) => {
        const formatted = moment(date).format('DD/MM/YYYY');
        setStartDate(formatted);
    };

    const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType });
    };


    const handleSubmit = async (e: any) => {

        e.preventDefault();

        if (
            !name ||
            !email ||
            !startDate ||
            !language ||
            !impression ||
            !gender ||
            !bio ||
            !imagePath ||
            images?.length === 0
        ) {
            let error = {} as ErrorState;
            if (!name) error.name = "Name is Required!";
            if (!email) error.email = "Email is Required!";
            if (!email.includes('@')) error.email = "Email must include '@'";
            if (!startDate) error.Dob = "Dob is Required!";
            if (!language) error.language = "Language is Required!";
            if (!impression) error.impression = "Impression is Required!";
            if (!gender) error.gender = "Gender is Required!";
            if (!bio) error.bio = "Bio is Required!";
            if (!imagePath) error.image = "Image is Required!";
            if (images?.length === 0) error.images = "Photo Gallery is Required!"

            return setError({ ...error });
        }

        const formData: any = new FormData();



        const appendIfChanged = (key: string, currentValue: any, originalValue: any) => {
            if (currentValue !== originalValue) {
                formData.append(key, currentValue || "");
            }
        };

        if (dialogueData) {
            formData.append("hostId", dialogueData._id);

            appendIfChanged("name", name, dialogueData.name);
            appendIfChanged("email", email, dialogueData.email);
            const formattedStartDate = moment(startDate, "DD/MM/YYYY").format("DD/MM/YYYY");
            const formattedDob = moment(dialogueData.dob, "DD/MM/YYYY").format("DD/MM/YYYY");

            appendIfChanged("dob", formattedStartDate, formattedDob);

            appendIfChanged("language", language, dialogueData.language);
            appendIfChanged("impression", impression, dialogueData.impression);
            appendIfChanged("bio", bio, dialogueData.bio);
            appendIfChanged("gender", gender, dialogueData.gender);
            appendIfChanged("video", video.file, dialogueData.video);
            if (image && imagePath !== dialogueData.imagePath) {
                formData.append("image", image);
            }
            if (countryDataSelect?.name?.common !== dialogueData?.country) {
                formData.append("country", selectedCountry?.name);
            }
            if (countryDataSelect?.flag !== dialogueData?.countryFlagImage) {
                formData.append("countryFlagImage", selectedCountry!.flag);
            }

            type ImageType = File | string | { url: string };

            for (const img of images as ImageType[]) {
                if (img instanceof File) {
                    formData.append("photoGallery", img);
                } else if (typeof img === "object" && "url" in img && typeof img.url === "string") {
                    const fileFromUrl = await urlToFile(
                        baseURL + img.url,
                        img.url.split("/").pop() || "image.jpg",
                        "image/jpeg"
                    );
                    formData.append("photoGallery", fileFromUrl);
                } else if (typeof img === "string") {
                    const fileFromUrl = await urlToFile(
                        baseURL + img,
                        img.split("/").pop() || "image.jpg",
                        "image/jpeg"
                    );
                    formData.append("photoGallery", fileFromUrl);
                }
            }



            dispatch(updateHost(formData));
        } else {
            // Always include all fields when creating
            formData.append("name", name || "");
            formData.append("email", email || "");
            const parsedDate = moment(startDate, "DD/MM/YYYY", true); // strict parsing

            if (parsedDate.isValid()) {
                formData.append("dob", parsedDate.format("DD/MM/YYYY"));
            } else {
                // Optionally show error or skip appending
            }

            formData.append("language", language);
            formData.append("impression", impression?.join(",") || "");
            formData.append("image", image);
            formData.append("country", selectedCountry?.name);
            formData.append("countryFlagImage", selectedCountry?.flag);
            formData.append("bio", bio);
            formData.append("gender", gender);
            formData.append("video", video.file);


            for (let i = 0; i < images.length; i++) {
                if (images[i] instanceof File) {
                    formData.append("photoGallery", images[i]);
                }
            }

            dispatch(createHost(formData));
        }

        dispatch(closeDialog());
    };


    const handleSelectChange = (selected: any | null) => {
        setSelectedCountry(selected);

        if (!selected) {
            return setError({
                ...error,
                country: `Country Is Required`,
            });
        } else {
            return setError({
                ...error,
                country: '',
            });
        }
    };

    const handleInputImage = (e: any) => {
        if (e.target.files) {
            setImage(e?.target?.files[0]);
            setImagePath(URL.createObjectURL(e.target.files[0]));
            setError({ ...error, image: "" });
        }
    };

    const onPreviewDrop = (acceptedFiles: FileWithPath[]) => {
        const validImages = acceptedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        if (validImages.length !== acceptedFiles.length) {
            alert("Only image files are allowed!");
            return;
        }
        const updatedImages = [...images, ...acceptedFiles];
        if (!acceptedFiles || acceptedFiles.length === 0) {
            setError({
                ...error,
                images: "Image Is Required",
            });
        } else {
            setError({
                ...error,
                images: "",
            });
        }
        setImages(updatedImages);
    };



    const removeImage = (file: File) => {
        const updatedImages = images.filter((ele) => ele !== file);
        setImages(updatedImages);
    };

    const impressionOptions = impressionList.map((item: any) => ({
        label: item.name,
        value: item.name, // or item.id if you prefer
    }));


    const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: any = e.target.files?.[0];
        setVideoPath(URL.createObjectURL(file));

        if (file) {
            const thumbnailBlob: any = await generateThumbnailBlob(file);

            if (thumbnailBlob) {
                const videoFileName = file ? file?.name : "video";
                const thumbnailFileName = `${videoFileName.replace(
                    /\.[^/.]+$/,
                    ""
                )}.jpeg`;

                const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
                    type: "image/jpeg",
                });
                setThumbnail([thumbnailFile]);
                setVideo({
                    file: file,
                    thumbnailBlob: thumbnailFile,
                });
            }
            setThumbnailKey((prevKey) => prevKey + 1);
        } else {

        }
        const selectedFile = e.target.files?.[0];

        const videoElement = document.createElement("video");
        if (selectedFile) {
            videoElement.src = URL.createObjectURL(selectedFile);
            videoElement.addEventListener("loadedmetadata", () => {
                const durationInSeconds = videoElement.duration;
            });
        }
    };

    const generateThumbnailBlob = async (file: File) => {
        return new Promise((resolve) => {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                video.currentTime = 1; // Set to capture the frame at 1 second
            };

            video.onseeked = async () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert the canvas to blob
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, "image/jpeg");
            };

            const objectURL = URL.createObjectURL(file);
            video.src = objectURL;

            return () => {
                URL.revokeObjectURL(objectURL);
            };
        });
    };



    return (
        <>
            <div className="dialog">
                <div style={{ width: "1800px" }}>
                    <div className="row justify-content-center">
                        <div className="col-xl-5 col-md-8 col-11">
                            <div className="mainDiaogBox" style={{ width: "700px" }}>
                                <div className="row justify-content-between align-items-center formHead">
                                    <div className="col-8">
                                        <h2 className="text-theme fs-26 m0">Host</h2>
                                    </div>

                                    <div className="col-4">
                                        <div
                                            className="closeButton"
                                            onClick={() => {
                                                dispatch(closeDialog());
                                            }}
                                            style={{ fontSize: "20px" }}

                                        >
                                            ✖
                                        </div>
                                    </div>
                                </div>


                                <div className="row  formFooter mt-3">
                                    <div className="col-6">
                                        <ExInput
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={name}
                                            label="Name"
                                            placeholder="Name"
                                            errorMessage={error && error.name}
                                            onChange={(e: any) => {
                                                setName(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        name: "Name is required",
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        name: "",
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <ExInput
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={email}
                                            label="Email"
                                            placeholder="Email"
                                            errorMessage={error && error.email}
                                            onChange={(e: any) => {
                                                const value = e.target.value;

                                                setEmail(value);
                                                if (!value) {
                                                    return setError({
                                                        ...error,
                                                        email: "Email is required",
                                                    });
                                                }
                                                else if (!value.includes('@')) {
                                                    return setError({
                                                        ...error,
                                                        email: "Email must include '@'",
                                                    });
                                                }
                                                else {
                                                    return setError({
                                                        ...error,
                                                        email: "",
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label>Dob</label>
                                        <br></br>
                                        <DatePicker
                                            selected={startDate ? moment(startDate, 'DD/MM/YYYY').toDate() : null}
                                            onChange={(date: Date) => {
                                                const formatted = moment(date).format('DD/MM/YYYY');
                                                setStartDate(formatted);
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                        />



                                    </div>

                                    <div className="col-6">
                                        <div className="inputData">
                                            <label className="  " htmlFor="category">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                className="rounded-2"
                                                id="category"
                                                value={gender}
                                                onChange={(e) => {
                                                    setGender(e.target.value);
                                                    setError((prev) => ({ ...prev, gender: e.target.value ? "" : "Gender is required" }));
                                                }}
                                            >
                                                <option value="">
                                                    --Select Gender--
                                                </option>
                                                {genderData?.map((data) => (
                                                    <option key={data.value} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {error?.gender && (
                                                <p className="errorMessage text-start">
                                                    {error && error?.gender}
                                                </p>
                                            )}
                                        </div>
                                    </div>


                                    <div className="col-6">
                                        <ExInput
                                            type="text"
                                            id="language"
                                            name="language"
                                            value={language}
                                            label="Language"
                                            placeholder="Language"
                                            errorMessage={error && error.language}
                                            onChange={(e: any) => {
                                                setLanguage(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        language: "Language is required",
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        language: "",
                                                    });
                                                }
                                            }}
                                        />
                                    </div>



                                    <div className="col-6 col-sm-12 col-md-12 col-lg-6">
                                        <div className="custom-input">
                                            <label className="">Country</label>
                                            <ReactSelect
                                                options={countryOptions} // FIXED: Use options array
                                                value={selectedCountry} // FIXED: Use selected country
                                                isClearable={true}
                                                isLoading={loadingCountries}
                                                placeholder="Select a country..."
                                                onChange={handleSelectChange}
                                                className="mt-2"
                                                classNamePrefix="react-select"
                                                formatOptionLabel={(option) => (
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            height={20}
                                                            width={28}
                                                            alt={option.name}
                                                            src={option.flagUrl}
                                                            className="me-2"
                                                            style={{ objectFit: 'cover' }}
                                                            onError={(e: any) => {
                                                                e.target.style.display = 'none'
                                                            }}
                                                        />
                                                        <span>{option.label}</span>
                                                    </div>
                                                )}
                                                components={{
                                                    Option: CustomOption,
                                                }}
                                                styles={{
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            backgroundColor: '#f8f9fa'
                                                        }
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <label className="mt-3" htmlFor="impression">
                                            Impression
                                        </label>
                                        <div style={{ marginTop: "10px" }}>
                                            <Select
                                                isMulti
                                                options={impressionOptions}
                                                value={impressionOptions.filter((option: any) =>
                                                    impression?.includes(option.label)
                                                )}
                                                onChange={(selectedOptions: any) => {
                                                    const selectedLabels = selectedOptions.map((option: any) => option.label);
                                                    setImpression(selectedLabels);
                                                    setError((prev) => ({
                                                        ...prev,
                                                        impression: selectedLabels.length > 0 ? "" : "Impression is required",
                                                    }));
                                                }}
                                                placeholder="--Select Impression--"
                                                styles={{
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: "white",
                                                        color: "black",
                                                        zIndex: 9999,
                                                    }),
                                                    menuList: (base) => ({
                                                        ...base,
                                                        maxHeight: "150px",
                                                        overflowY: "auto",
                                                    }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                                                        color: "black",
                                                        cursor: "pointer",
                                                    }),
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
                                                        boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(13,110,253,.25)" : "none",
                                                        "&:hover": {
                                                            borderColor: "#86b7fe",
                                                        },
                                                    }),
                                                    multiValue: (base) => ({
                                                        ...base,
                                                        backgroundColor: "#e7e7e7",
                                                    }),
                                                    multiValueLabel: (base) => ({
                                                        ...base,
                                                        color: "black",
                                                    }),
                                                }}
                                            />

                                        </div>

                                        {error?.impression && (
                                            <p className="text-danger text-start">
                                                {error && error?.impression}
                                            </p>
                                        )}
                                    </div>




                                    <div className="col-6 mt-2">
                                        <Textarea
                                            row={3}
                                            type={`text`}
                                            id={`bio`}
                                            name={`bio`}
                                            value={bio}
                                            defaultValue={
                                                bio && bio
                                            }
                                            label={`Bio`}
                                            placeholder={`Bio`}
                                            errorMessage={
                                                error.bio && error.bio
                                            }
                                            onChange={(e: any) => {
                                                setBio(e.target.value);
                                                if (!e.target.value) {
                                                    return setError({
                                                        ...error,
                                                        bio: `Bio is required`,
                                                    });
                                                } else {
                                                    return setError({
                                                        ...error,
                                                        bio: "",
                                                    });
                                                }
                                            }}
                                        />
                                    </div>


                                    <div className="mt-2 col-6">
                                        <ExInput
                                            id="image"
                                            name="image"
                                            type={"file"}
                                            label={"Image"}
                                            accept={"image/png, image/jpeg"}
                                            errorMessage={error.image && error.image}
                                            onChange={handleInputImage}
                                        />


                                    </div>

                                    <div className="col-6 mt-2">
                                        <ExInput
                                            label={`Video`}
                                            id={`video`}
                                            type={`file`}
                                            accept={`video/*`}
                                            errorMessage={error.video}
                                            onChange={handleVideo}
                                        />
                                    </div>
                                    <div className="col-6 mt-2 fake-create-img mb-2">
                                        {imagePath && (
                                            <>
                                                <img
                                                    src={imagePath ? imagePath : dialogueData?.image}
                                                    className="mt-3 rounded float-left mb-2"
                                                    alt="image"
                                                    style={{ width: "100px", height: "100px" }}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {video.file ? (
                                        <div className="col-6 d-flex mt-4 videoShow">
                                            <video
                                                controls
                                                style={{ width: "150px", height: "150px" }}
                                                src={video.file ? URL?.createObjectURL(video.file) : ""}
                                            />
                                            <img
                                                src={
                                                    video.thumbnailBlob
                                                        ? URL?.createObjectURL(video.thumbnailBlob)
                                                        : ""
                                                }
                                                style={{
                                                    width: "150px",
                                                    height: "150px",
                                                    marginLeft: "20px",
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="col-6 d-flex mt-4">
                                                <video
                                                    controls
                                                    style={{ width: "200px", height: "200px" }}
                                                    src={videoPath}
                                                />
                                            </div>
                                        </>
                                    )}



                                    <div className="col-12 mt-2">
                                        <div className="custom-input">
                                            <label>Photo Gallery</label>
                                            <>
                                                <ReactDropzone
                                                    onDrop={(acceptedFiles: FileWithPath[]) => onPreviewDrop(acceptedFiles)}
                                                    accept={"image/*" as unknown as Accept}
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section className="mt-4">
                                                            <div {...getRootProps()}>
                                                                <input {...getInputProps()} />
                                                                <div
                                                                    style={{
                                                                        height: "130px",
                                                                        width: "130px",
                                                                        borderRadius: "11px",
                                                                        border: "2px dashed rgb(185 191 199)",
                                                                        textAlign: "center",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        marginTop: "10px",
                                                                    }}
                                                                >
                                                                    <AddIcon
                                                                        sx={{
                                                                            fontSize: "40px",
                                                                            color: "rgb(185 191 199)",
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </section>
                                                    )}
                                                </ReactDropzone>

                                                {error.images && (
                                                    <div className="ml-2 mt-1">
                                                        <div className="pl-1 text__left">
                                                            <span className="text-danger">{error.images}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        </div>
                                    </div>

                                    <div className="col-12 d-flex flex-wrap">
                                        <div className="row image-show-multi">
                                            {images?.map((file: any, index: number) => {
                                                const isFile = file instanceof File;
                                                return (
                                                    <div key={index} className="image-grid-multi">
                                                        <div className="image-show-multi-box">
                                                            {
                                                                file?.url ?

                                                                    <img
                                                                        src={isFile ? URL.createObjectURL(file) : file ? baseURL + file?.url : ""}
                                                                        alt=""
                                                                        className="mt-3 ms-3 rounded float-left mb-2"
                                                                        height="100px"
                                                                        width="100px"
                                                                    /> :

                                                                    <img
                                                                        src={isFile ? URL.createObjectURL(file) : file ? baseURL + file : ""}
                                                                        alt=""
                                                                        className="mt-3 ms-3 rounded float-left mb-2"
                                                                        height="100px"
                                                                        width="100px"
                                                                    />
                                                            }

                                                            <IconButton
                                                                onClick={() => removeImage(file)}
                                                                style={{
                                                                    position: "absolute",
                                                                    left: "106px",
                                                                    cursor: "pointer",
                                                                    background: "red",
                                                                    color: "white",
                                                                    height: "30px",
                                                                    width: "30px"
                                                                }}
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        </div>
                                    </div>

                                    <div className="col-12 text-end m0">
                                        <Button
                                            className={`bg-gray text-white`}
                                            text={`Cancel`}
                                            type={`button`}
                                            onClick={() => dispatch(closeDialog())}
                                        />
                                        <Button
                                            type={`submit`}
                                            className={` text-white m10-left`}
                                            style={{ backgroundColor: "#1ebc1e" }}
                                            text={`Submit`}
                                            onClick={(e: any) => handleSubmit(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HostDialog;
