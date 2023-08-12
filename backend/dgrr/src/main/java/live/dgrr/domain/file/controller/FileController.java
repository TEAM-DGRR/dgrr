package live.dgrr.domain.file.controller;

import live.dgrr.domain.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;

@CrossOrigin("*")
@RequiredArgsConstructor
@RestController
public class FileController {

    private final FileService fileService;

    @PostMapping("/api/v1/file")
    public ResponseEntity<URL> uploadFile(MultipartFile file){
        return ResponseEntity.ok(fileService.uploadFile(file));
    }
}